import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Graph from "react-graph-vis";


function KnowledgeGraph() {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);
    // const [selectedYear, setSelectedYear] = useState(2010);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [graph, setGraph] = useState({ nodes: [], edges: [] });
    
    const environment = "dev"
    const apiUrl = environment === "dev" ? "http://127.0.0.1:5000" : "https://finance-risk-toolkit-api-scx3vdzzxa-ue.a.run.app";


    const handleCompanyClick = (ticker) => {
        navigate(`/ticker/${ticker}`, { state: { title: 'Financial Event Risk Analysis Tool', year: 2024 } });
    };

    const sectors = {
        "1": "Consumer",
        "2": "Manufacturing",
        "3": "HiTec",
        "4": "Health and Medical",
        "5": "Energy",
        "6": "Other including Finance"
    };
    
    const sectorColors = {
        "1": "#3498db", // Consumer - Blue
        "2": "#2ecc71", // Manufacturing - Green
        "3": "#f39c12", // HiTec - Orange
        "4": "#e74c3c", // Health and Medical - Red
        "5": "#9b59b6", // Energy - Purple
        "6": "#FA8072"  // Other including Finance - Gray
    };

    const eventType = {
        "1": "General",
        "2": "Weather",
        "3": "Political",
        "4": "Economy",
        "5": "Energy",
        "6": "Business"
    };

    const eventColors = {
        "1": "#e74c3c", // Consumer - Blue
    };
    
    const renderRiskFactors = (response) => {
        // Convert response to an array
        // const responseList = JSON.parse(response.replace(/'/g, '"'));
        const responseList = Array.from(new Set(JSON.parse(response.replace(/'/g, '"'))));

        return responseList.map((item, index) => (
            <li key={index} className="text-left">{item}</li>
        ));
    }

    // const renderConnectedCompanies = (response) => {
    //     // Convert response to an array
    //     const responseList = Array.from(new Set(JSON.parse(response.replace(/'/g, '"'))));

    //     return responseList.map((item, index) => (
    //         <li key={index} className="text-left">{item}</li>
    //     ));
    // }

    function fetchGraphData(e=null, all=false) {
        if (e != null) {
            e.preventDefault();
        }

        fetch(`${apiUrl}/api/graph-data`)
            .then(response => response.json())
            .then(data => {

                const updatedNodes = data.nodes.map(node => {
                    if (node.type === "company") {
                        node.size = 10;
                        node.shape = "dot"; // Set shape for company nodes
                    } else if (node.type === "event") {
                        node.size = 20;
                        node.shape = "square"; // Set shape for event nodes
                    }
                    return node;
                });
                setGraph({ ...data, nodes: updatedNodes });
            })
            .catch(error => console.error('Error fetching graph data:', error));
    }

    useEffect(() => {
        fetchGraphData();
    }, [apiUrl]);
    
    

    const events = {
        selectNode: function (event) {
            const { nodes } = event;
            const selectedNode = graph.nodes.find(node => node.id === nodes[0]);
            
            if (selectedNode) {
                console.log(selectedNode)
                console.log(selectedNode.shape)
                if (selectedNode.shape === "circle") {
                    setSelectedCompany(selectedNode);
                    setSelectedEvent(null); // Clear any selected event
                } else if (selectedNode.shape === "square") {
                    setSelectedEvent(selectedNode);
                    setSelectedCompany(null); // Clear any selected company
                }
            }
        }
    };
    

    const options = {
        layout: {
            hierarchical: false,
            improvedLayout: true

        },
        edges: {
            color: "#2c3e50"
        },
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                gravitationalConstant: -50,
                centralGravity: 0.01,
                springLength: 100,
                springConstant: 0.08,
                damping: 0.4,
                avoidOverlap: 1
            }
        },
        nodes: {
            shape: "dot", // Set default shape
            scaling: {
                min: 10,
                max: 20,
                label: {
                    enabled: true,
                    min: 14,
                    max: 10
                }
            },
            font: {
                multi: true
            }
        },
        interaction: {
            // zoomView: false,
            dragView: true
        }
    };


    return (
        <div>
            <Navbar></Navbar>
            <div className="flex mx-auto p-4">
                <div className='border w-1/2 mx-4'>
                    <h2 className="mr-2 font-bold text-xl text-center my-2">Legend</h2>
                    <div className='flex justify-around'>
                        <div className="flex flex-col flex-wrap text-center justify-center mb-5">
                            <h3 className="mr-2 font-bold text-lg text-center my-2">Company Sector</h3>
                            {Object.entries(sectors).map(([key, sector]) => (
                                <div key={key} className="flex text-center items-center mx-auto mb-1">
                                <span
                                    className={`w-4 h-4 rounded-full mr-1`}
                                    style={{ backgroundColor: sectorColors[key] }}
                                ></span>
                                {sector}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col flex-wrap text-center justify-center mb-5">
                            <h3 className="mr-2 font-bold text-lg text-center my-2">Event Type</h3>
                            {Object.entries(eventType).map(([key, sector]) => (
                                <div key={key} className="flex text-center items-center mx-auto mb-1">
                                <span
                                    className={`w-4 h-4 mr-1`}
                                    style={{ backgroundColor: sectorColors[key] }}
                                ></span>
                                {sector}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='border w-1/2 mx-4'>
                    {selectedCompany && (
                        <div className="flex flex-col flex-wrap text-center justify-center mb-5">
                            <h3 className="mr-2 font-bold text-lg text-center my-2">Selected Company</h3>
                            <p className="text-center">{selectedCompany.label}</p>
                            <p className="text-center"><b>Sector:</b> {selectedCompany.sector}</p>
                            <p className="text-center"><b>Ticker:</b> {selectedCompany.ticker}</p>

                            <br></br>
                            <b><p className="text-center">Risk Factors</p></b>
                            
                            
                            <div className='px-4'>
                                <ul className='list-disc mx-4 '>
                                    {renderRiskFactors(selectedCompany.response)}
                                </ul>
                            </div>

                            <br></br>
                            <a className="text-center link" onClick={() => handleCompanyClick(selectedCompany.ticker)}>View Stock Chart</a>
                        </div>
                    )}
                    {selectedEvent && (
                        <div className="flex flex-col flex-wrap text-center justify-center mb-5">
                            <h3 className="mr-2 font-bold text-lg text-center my-2">Selected Event</h3>
                            <p className="text-center my-3">{selectedEvent.label}</p>
                            <p className="text-center"><b>Type:</b> {selectedEvent.title}</p>

                            <b><p className="text-center">Companies At Risk</p></b>
                            <br></br>
                            <div className='px-4 mx-auto'>
                                <ul className='list-disc mx-4 w-80'>
                                    {/* {renderConnectedCompanies(selectedEvent.connected_companies)} */}
                                    {
                                        selectedEvent.connected_companies.map((item, index) => (
                                            <li key={index} className="text-left">{item}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    )}

                    {!selectedEvent && !selectedCompany && (
                        <div className="flex flex-col flex-wrap text-center justify-center mb-5">
                            <h3 className="mr-2 font-bold text-lg text-center my-2">Select a Company or Event</h3>

                            <b><p className="text-center">Click a company or event for more details on the event</p></b>
                            <br></br>
                            <p className="text-center">The color of the company or event indicates what type it is.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* <div className='mx-auto flex justify-center container align-middle mb-4'>
                <input 
                    type="number" 
                    placeholder="Enter Year Here" 
                    className="input input-bordered w-48 mx-2"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                />
                <form onSubmit={fetchGraphData()} className="mx-2">
                    <button type="submit" className="btn btn-secondary">Filter by Year</button>
                </form>
            </div> */}
            
            <div className="container text-center mx-auto border">
                <Graph graph={graph} options={options} events={events} style={{ height: "700px" }} />
            </div>
        </div>
    );
}

export default KnowledgeGraph;
