import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Graph from "react-graph-vis";


function KnowledgeGraph() {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);
    // const [selectedYear, setSelectedYear] = useState(2010);
    const [selectedEventType, setSelectedEventType] = useState("All");
    const [selectedSector, setSelectedSector] = useState("All");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [minConnection, setMinConnection] = useState(2);
    const [graph, setGraph] = useState({ nodes: [], edges: [] });
    
    const environment = "prod"
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
        "1": "#ffd6ba",
        "2": "#5DADE2",
        "3": "#F1C40F",
        "4": "#417B5A",
        "5": "#E67E22",
        "6": "#8E44AD"
    };
    
    const renderRiskFactors = (response) => {
        // Convert response to an array
        var responseList = "";
        try {
            // responseList = Array.from(new Set(JSON.parse(response.replace(/'/g, '"'))));
            responseList = response.replace(/'\s*,\s*'/g, '", "').replace(/^\['/, '["').replace(/'\]$/, '"]');
            responseList = JSON.parse(responseList);
        } catch(e) {
            console.log(e);
            return <li key={e} className="text-left text-red-600">Error in Parsing Risk Factors</li>
        }

        return responseList.map((item, index) => (
            <li key={index} className="text-left">{item}</li>
        ));
    }

    function fetchGraphData(e=null, all=false) {
        if (e != null) {
            e.preventDefault();
        }

        setGraph({});
        fetch(`${apiUrl}/api/graph-data2?minConnections=${minConnection}&sector=${selectedSector}&type=${selectedEventType}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
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
    }, [apiUrl, minConnection, selectedEventType, selectedSector]);
    
    

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
            // solver: 'forceAtlas2Based',
            // forceAtlas2Based: {
            //     gravitationalConstant: -50,
            //     centralGravity: 0.01,
            //     springLength: 100,
            //     springConstant: 0.08,
            //     damping: 0.4,
            //     avoidOverlap: 1
            // }
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
            <div className="container text-center mx-auto">
                <h1 className="text-3xl font-semibold p-4">Knowledge Graph</h1>
            </div>
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
                                    style={{ backgroundColor: eventColors[key] }}
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
                            <p className="text-center"><b>Type:</b> {selectedEvent.event_type}</p>

                            <br></br>
                            <b><p className="text-center">Companies At Risk</p></b>
                            <div className='px-4 mx-auto'>
                                <ul className='list-disc mx-4 w-80'>
                                    {
                                        selectedEvent.connected_companies.map((item, index) => (
                                            <li key={index} className="text-left">{item.split("_")[0]}</li>
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
            <div className='flex justify-center items-center my-5'>
                <p className='inline-block text-center w-32 mb-2 mx-2'>Filter by Sector</p>
                <select 
                    className="select select-bordered mb-2 mx-2" 
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                >
                    <option key="All" value="All">All</option>
                    <option key="Consumer" value="Consumer">Consumer</option>
                    <option key="Manufacturing" value="Manufacturing">Manufacturing</option>
                    <option key="HiTec" value="HiTec">HiTec</option>
                    <option key="Health and Medical" value="Health and Medical">Health and Medical</option>
                    <option key="Energy" value="Energy">Energy</option>
                    <option key="Other including Finance" value="Other including Finance">Other including Finance</option>
                </select>
                <p className='inline-block text-center w-36 mb-2 mx-2'>Filter By Event Type</p>
                <select 
                    className="select select-bordered mb-2 mx-2" 
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value)}
                >
                    <option key="All" value="All">All</option>
                    <option key="General" value="General">General</option>
                    <option key="Weather" value="Weather">Weather</option>
                    <option key="Political" value="Political">Political</option>
                    <option key="Economy" value="Economy">Economy</option>
                    <option key="Energy" value="Energy">Energy</option>
                    <option key="Finance" value="Finance">Business</option>
                </select>
            </div>
            <div className='flex justify-center items-center my-5'>
                <p className='inline-block text-center w-52 mb-2 mx-2'>Select the Minimum Number of Connections</p>
                <select 
                    className="select select-bordered mb-2 mx-2" 
                    value={minConnection}
                    onChange={(e) => setMinConnection(e.target.value)}
                >
                    <option key="1" value="1">1 Connection</option>
                    <option key="2" value="2">2 Connections</option>
                    <option key="3" value="3">3 Connections</option>
                </select>
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
            
            <div className="container text-center mx-auto border-4">
                <Graph graph={graph} options={options} events={events} style={{ height: "700px" }} />
            </div>
        </div>
    );
}

export default KnowledgeGraph;
