import React, { useState } from "react";
import { Box, Button, Heading, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Link, Text, Code } from "@chakra-ui/react";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const results = csvToArray(text);
      setCsvData(results);
    };
    reader.readAsText(file);
  };

  const csvToArray = (str, delimiter = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map((row) => {
      const values = row.split(delimiter);
      const el = headers.reduce((object, header, index) => {
        try {
          object[header] = JSON.parse(values[index]);
        } catch (e) {
          object[header] = values[index];
        }
        return object;
      }, {});
      return el;
    });
    return arr;
  };

  const uniqueProjects = [...new Set(csvData.map((row) => row.__path__.split("/")[1]))];

  const filteredData = csvData.filter((row) => row.type === "ai_update" && row.__path__.startsWith(`projects/${selectedProject}`));

  return (
    <Box>
      <Heading mb={4}>Project Edit Viewer</Heading>
      <Input type="file" onChange={handleFileUpload} mb={4} />

      <Select placeholder="Select project" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} mb={4}>
        {uniqueProjects.map((project) => (
          <option key={project} value={project}>
            {project}
          </option>
        ))}
      </Select>

      <Table>
        <Thead>
          <Tr>
            <Th>Edit ID</Th>
            <Th>Commit SHA</Th>
            <Th>Commit Link</Th>
            <Th>Tag Output</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((row) => (
            <Tr key={row.id}>
              <Td>{row.id}</Td>
              <Td>{row.commit_sha}</Td>
              <Td>
                {row.commit_sha && (
                  <Link href={`https://github.com/search?q=commit%3A+${row.commit_sha}&type=commits`} isExternal>
                    View Commit
                  </Link>
                )}
              </Td>
              <Td>
                <Code whiteSpace="pre">{JSON.stringify(row.tags, null, 2)}</Code>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {filteredData.length === 0 && <Text>No edits found for the selected project.</Text>}
    </Box>
  );
};

export default Index;
