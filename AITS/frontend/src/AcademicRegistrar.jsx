import React, { useState, useEffect } from 'react';

const AcademicRegistrar = () => {
       const [issues, setIssues] = useState([]);
       const [unresolvedIssues, setUnresolvedIssues] = useState([]);
       const [report, setReport] = useState({});

       useEffect(() => {
              // Fetch issues from an API or database
              fetchIssues();
       }, []);

       const fetchIssues = async () => {
              // Replace with actual API call
              const fetchedIssues = await fakeApiCall();
              setIssues(fetchedIssues);
              setUnresolvedIssues(fetchedIssues.filter(issue => !issue.resolved));
              generateReport(fetchedIssues);
       };

       const assignIssue = (issueId, lecturerOrDepartment) => {
              // Logic to assign issue to a lecturer or department
              console.log(`Assigning issue ${issueId} to ${lecturerOrDepartment}`);
       };

       const generateReport = (issues) => {
              // Logic to generate report on issue trends
              const reportData = issues.reduce((acc, issue) => {
                     acc[issue.type] = (acc[issue.type] || 0) + 1;
                     return acc;
              }, {});
              setReport(reportData);
       };

       return (
              <div>
                     <h1>Academic Registrar Dashboard</h1>
                     <h2>All Issues</h2>
                     <ul>
                            {issues.map(issue => (
                                   <li key={issue.id}>
                                          {issue.description} - {issue.resolved ? 'Resolved' : 'Unresolved'}
                                          <button onClick={() => assignIssue(issue.id, 'Lecturer/Department')}>Assign</button>
                                   </li>
                            ))}
                     </ul>
                     <h2>Unresolved Issues</h2>
                     <ul>
                            {unresolvedIssues.map(issue => (
                                   <li key={issue.id}>{issue.description}</li>
                            ))}
                     </ul>
                     <h2>Issue Trends Report</h2>
                     <ul>
                            {Object.keys(report).map(type => (
                                   <li key={type}>{type}: {report[type]}</li>
                            ))}
                     </ul>
              </div>
       );
};

// Fake API call function
const fakeApiCall = async () => {
       return [
              { id: 1, description: 'Issue 1', resolved: false, type: 'Type A' },
              { id: 2, description: 'Issue 2', resolved: true, type: 'Type B' },
              { id: 3, description: 'Issue 3', resolved: false, type: 'Type A' },
       ];
};

export default AcademicRegistrar;