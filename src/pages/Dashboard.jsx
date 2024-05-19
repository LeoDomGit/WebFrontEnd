/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { DataGrid } from '@mui/x-data-grid';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import axios from 'axios';
import Loading from "../components/Loading";
function Dashboard() {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const [loading,setLoading]= useState(false);
    const handleShow1 = () => setShow1(true);
    const [email,setEmail]= useState('');
    const [email1,setEmail1]= useState('');
    const notyf = new Notyf({
        duration: 1000,
        position: {
          x: "right",
          y: "top",
        },
        types: [
          {
            type: "warning",
            background: "orange",
            icon: {
              className: "material-icons",
              tagName: "i",
              text: "warning",
            },
          },
          {
            type: "error",
            background: "indianred",
            duration: 2000,
            dismissible: true,
          },
        ],
      });
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + 'scores/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const flattenedData = [];

    // Flatten the data for DataGrid
    data.forEach(user => {
        const rowData = {
            id: user.id,
            name: user.name,
        };

        user.scores.forEach((score, index) => {
            rowData[`game${index + 1}`] = score.score;
        });

        flattenedData.push(rowData);
    });

    const SubmitSendMail = ()=>{
        if(email==''){
            notyf.open({
                type: "error",
                message:'Email is required',
              });
        }else{
            axios.post(process.env.REACT_APP_API_URL + 'scores/export', {
                email: email
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                setLoading(true);
                if(res.data.check==true){
                setLoading(false);
                    notyf.open({
                        type: "success",
                        message:'Report sent successfully ! Please check',
                      });
                      setEmail('');
                      setShow(false);
                }
            })
        }
    }
    const SubmitSendMail1 = ()=>{
        if(email1==''){
            notyf.open({
                type: "error",
                message:'Email is required',
              });
        }else{
            axios.post(process.env.REACT_APP_API_URL + 'users/export', {
                email: email1
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                setLoading(true);
                if(res.data.check==true){
                setLoading(false);
                    notyf.open({
                        type: "success",
                        message:'Report sent successfully ! Please check',
                      });
                      setEmail1('');
                      setShow1(false);
                }
            })
        }
    }
    const columns = [
        { field: 'name', headerName: 'Name', width: 150 }
    ];

    if (data.length > 0) {
        const maxGames = data.reduce((max, user) => Math.max(max, user.scores.length), 0);
        for (let i = 1; i <= maxGames; i++) {
            columns.push({
                field: `game${i}`,
                headerName: `Game ${i}`,
                width: 150
            });
        }
    }

    return (
        <Layout>
            <div style={{ height: 400, width: '100%' }}>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Email</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn btn-sm btn-warning' variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button className='btn btn-sm btn-primary' variant="primary"  onClick={(e)=>SubmitSendMail()}>
                           Send
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show1} onHide={handleClose1}>
                    <Modal.Header closeButton>
                        <Modal.Title>Email</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" className="form-control" value={email1} onChange={(e)=>setEmail1(e.target.value)} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn btn-sm btn-warning' variant="secondary" onClick={handleClose1}>
                            Close
                        </Button>
                        <Button className='btn btn-sm btn-primary' variant="primary"  onClick={(e)=>SubmitSendMail1()}>
                           Send
                        </Button>
                    </Modal.Footer>
                </Modal>
                    <a href={process.env.REACT_APP_API_URL + 'scores/export'} className='btn btn-sm btn-primary mb-2'>Export Game History </a>
                    <button className='btn btn-sm btn-warning mb-2 ms-2' onClick={(e)=>handleShow()}>Export Game History To Mail </button>
                    <a href={process.env.REACT_APP_API_URL + 'scores/export'} className='btn btn-sm btn-primary ms-2 mb-2'>Export Users History </a>
                    <button className='btn btn-sm btn-warning mb-2 ms-2' onClick={(e)=>handleShow1()}>Export Users To Mail </button>
                    <div style={{ height: '400px', width: '100%' }}>
                    <DataGrid
                        rows={flattenedData}
                        columns={columns}
                        pageSize={5}
                        autoPageSize
                    />
                </div>
              
            </div>
        </Layout>
    );
}

export default Dashboard;
