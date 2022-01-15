import React, { useEffect, useState } from 'react';

import { AUTH_TOKEN_KEY, CURRENT_WEEK_KEY } from '../../consts';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';

import ProjectifyLogo from '../../assets/small_logo.png'

import { getAllDedications,  createDedication, deleteDedication, editDedication } from '../../services/DedicationService';
import getAllProjects from '../../services/ProjectsService';
import logoutService from '../../services/AuthService';

import './Dashboard.css';


export default function Dashboard() {

  const [projects, setProjects] = useState();
  const [newDedicationProjectId, setNewDedicationProjectId] = useState('');
  const [newDedicationPct, setNewDedicationPct] = useState(0);

  if (!window.sessionStorage.getItem(AUTH_TOKEN_KEY)) {
    window.location.href = "/login";
  }

  useEffect(()=>{
    getProjects();
  }, []);

  function getProjects() {
    let projectsData = [];
    getAllProjects()
    .then((projectsResponseData) => {
      getAllDedications()
      .then((dedicationsResponseData) => {
        let canAdd = true;
        projectsResponseData.data.forEach(project => {
          let dedications = dedicationsResponseData.data.filter(dedication => dedication.project_id === project.id);
          canAdd = dedications.filter(dedication => `${dedication.week_number}` === sessionStorage.getItem(CURRENT_WEEK_KEY)).length === 0 ? true : false; 
          projectsData.push({
            'id' : project.id,
            'name': project.name,
            'dedications': dedicationsResponseData.data.filter(dedication => dedication.project_id === project.id),
            'can_add': canAdd
          });
        });
        setProjects(projectsData);
        setNewDedicationProjectId(projectsData.find(project => project.can_add === true).id);
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
    .catch(() => {
      console.log("ERROR!")
    })
  };

  function onDeleteDedication(id) {
    deleteDedication(id)
    .then(() => {
      getProjects();
    })
    .catch(() => {
      console.log("ERROR!")
    })
  };

  function onCreateDedication() {
    let data = {
      "project_id": newDedicationProjectId,
      "week_number": sessionStorage.getItem(CURRENT_WEEK_KEY),
      "pct_dedication": newDedicationPct
    }
    createDedication(data)
    .then(() => {
      getProjects();
    });
  };

  function logout() {
    logoutService();
  };
  
  return(
    <div>
      <div className="dashboard-header">
        <img src={ProjectifyLogo} alt="Projectify" />
        <p>PROJECT DASHBOARD</p>
        <button onClick={logout}>LOGOUT</button>
      </div>
      <div className="dashboard-content">
        {projects && projects.map((project) => {
          return (
            <Accordion key={project.id}>
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
                        <tr
                          key={dedication.id}
                        >
                          <td>{dedication.week_number}</td>
                          <td>
                            <TextField
                              id={`${dedication.id}`}
                              type="number"
                              defaultValue={dedication.pct_dedication}
                              InputProps={{ inputProps: { min: 0, max: 100 } }}
                              onChange={(event) => onEditDedication(event.target.value, event.target.id)}
                            />
                          </td>
                          <td>
                            <button 
                              className="delete-dedication-button"
                              id={`${dedication.id}`}
                              onClick={() => {onDeleteDedication(dedication.id)}}
                            >
                              <DeleteIcon />
                            </button>
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
          <FormControl fullWidth className="add-dedication-form">
            <Select
              label="<--Select Project-->"
              value={newDedicationProjectId}
              onChange={(event) => setNewDedicationProjectId(event.target.value)}
            >
              {projects && projects.map((project) => {
                  if (project.can_add) {
                    return (
                      <MenuItem key={`add-to-${project.id}`} value={project.id}>{project.name}</MenuItem>
                    );
                  }
                  return null;
              })}
            </Select>
            <TextField
              id="new_id"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              defaultValue={0}
              onChange={(event) => setNewDedicationPct(event.target.value)}
            />
            <button id="add-dedication-button" onClick={onCreateDedication}>ADD DEDICATION</button>
          </FormControl>
        </div>
    </div>
  );
}