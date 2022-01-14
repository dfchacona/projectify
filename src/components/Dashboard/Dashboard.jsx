import React, { useEffect, useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import getAllDedications, { createDedication, editDedication } from '../../services/DedicationService';
import getAllProjects from '../../services/ProjectsService';
import getCurrentWeek from '../../services/Utils';
import { CURRENT_WEEK_NUMBER } from '../../consts';

export default function Dashboard() {

  const [projects, setProjects] = useState();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [newDedicationProjectId, setNewDedicationProjectId] = useState(1);
  const [newDedicationPct, setNewDedicationPct] = useState(0);

  if (!window.sessionStorage.getItem("auth_token")) {
    window.location.href = "/login";
  }

  useEffect(()=>{
    getProjects();
    setCurrentWeek(getCurrentWeek());
  }, [])

  function getProjects() {
    let projectsData = [];
    getAllProjects()
    .then((projectsResponseData) => {
      getAllDedications()
      .then((dedicationsResponseData) => {
        let canAdd = true;
        projectsResponseData.data.forEach(project => {
          let dedications = dedicationsResponseData.data.filter(dedication => dedication.project_id === project.id);
          canAdd = dedications.filter(dedication => dedication.week_number === getCurrentWeek()).length === 0 ? true : false; 
          projectsData.push({
            'id' : project.id,
            'name': project.name,
            'dedications': dedicationsResponseData.data.filter(dedication => dedication.project_id === project.id),
            'can_add': canAdd
          });
        });
        setProjects(projectsData);
        console.log(projectsData)
      })
      .catch(() => {
        console.log("ERROR!")
      });
    })
    .catch(() => {
      console.log("ERROR!")
    });
  }

  function onEditDedication(value, id) {
    let data = {
      "pct_dedication": value
    }
    editDedication(id, data)
    .then((editDedicationResponse) => {
      console.log(editDedicationResponse);
    })
    .catch(() => {
      console.log("ERROR!")
    })
  }

  function onCreateDedication() {
    let data = {
      "project_id": newDedicationProjectId,
      "week_number": CURRENT_WEEK_NUMBER,
      "pct_dedication": newDedicationPct
    }
    createDedication(data)
    .then((createDedicationResponse) => {
      getProjects();
    });
  }
  
  return(
    <div>
      <h2>Project Dashboard</h2>
        {projects && projects.map((project) => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{project.name}</Typography>
              </AccordionSummary>
            <AccordionDetails>
              <table>
                <thead>
                  <tr>
                    <th>Week number</th>
                    <th>Dedication (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {project.dedications && project.dedications.map((dedication) => {
                    return (
                      <tr>
                        <td>{dedication.week_number}</td>
                        <td>
                          <TextField
                            id={`${dedication.id}`}
                            type="number"
                            defaultValue={dedication.pct_dedication}
                            onChange={(event) => onEditDedication(event.target.value, event.target.id)}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </AccordionDetails>
          </Accordion>
          )
        })}
         <h3>Add new dedication</h3>
        <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newDedicationProjectId}
              label="Age"
              onChange={(event) => setNewDedicationProjectId(event.target.value)}
            >
              {projects && projects.map((project) => {
                  if (project.can_add) {
                    return (
                      <MenuItem value={project.id}>{project.name}</MenuItem>
                    );
                  }
                  return null;
                })}
          </Select>
          <TextField
            id={`new_id`}
            type="number"
            defaultValue={0}
            onChange={(event) => setNewDedicationPct(event.target.value)}
          />
          <button onClick={onCreateDedication}>Add Dedication</button>
        </FormControl>
    </div>
  );
}