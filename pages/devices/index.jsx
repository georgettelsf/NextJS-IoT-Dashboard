import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import api from '../../api';
import { makeStyles } from '@material-ui/core/styles';
import { Edit, Delete, Code } from '@material-ui/icons';

import {
    Button,
    LinearProgress,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import CreateDevice from '../../components/CreateDevice';
import generate from '../../codeGenerator';
import GenerateCode from '../../components/GenerateCode';

const useStyles = makeStyles({
    container: {
        marginTop: 100
    },
    table: {
        minWidth: 650,
    },
});

export default function Devices() {
    const [devices, setDevices] = React.useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        api.get('/api/devices').then((response) => {
            console.log(response.data.data);
            setDevices(response.data.data);
        }).catch(console.log)
    }, []);

    return (
        <div className={classes.container}>
            <Button variant="contained" color="primary" onClick={() => { setCreateModalOpen(true) }}>Create new device</Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Token</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th">
                                    {row.name}
                                </TableCell>
                                <TableCell >{row.token}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => {
                                        setSelectedDevice(row)
                                        // console.log(generate(row.token, row.variables))
                                    }}><Code /></Button>
                                    <Button onClick={() => { }}><Edit /> </Button>
                                    <Button onClick={() => {
                                        api.delete('/api/devices/' + row.id).then(() => {
                                            setDevices(devices => devices.filter(device => device.id !== row.id));
                                        })
                                    }}><Delete /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            { createModalOpen && <CreateDevice open={createModalOpen} handleClose={() => setCreateModalOpen(false)} />}
            { selectedDevice && <GenerateCode open={selectedDevice} handleClose={() => setSelectedDevice(null)} />}
        </div >
    );
}