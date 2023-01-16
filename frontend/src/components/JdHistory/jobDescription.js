import React, { useEffect, useState } from 'react';
import PageHeader from '../utils/PageHeader';
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from '@material-ui/core';
import Jdmodal from './JdInfo/JdDetail';
import useTable from '../utils/useTable';
import Controls from '../utils/controls/Controls';
import { Search } from '@material-ui/icons';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DescriptionIcon from '@material-ui/icons/Description';
import PageviewSharpIcon from '@material-ui/icons/PageviewSharp';
import InfoIcon from '@material-ui/icons/Info';
import Notification from '../utils/Notification';
import ConfirmDialog from '../utils/ConfirmDialog';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: '200pt',
  },
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
    fontSize: 34,
  },
  searchInput: {
    width: '75%',
    fontSize: '20px',
  },
  newButton: {
    position: 'absolute',
    right: '10px',
    fontSize: '20px',
  },
}));

const headCells = [
  { id: 'fullName', label: 'JD Title' },
  { id: 'email', label: 'Author Email ' },
  { id: 'actions', label: 'Actions', disableSorting: true },
];

export default function JobDescription({ currentUser }) {
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
  });

  const handleRedirect = e => {
    const url =
      e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].innerText.split(
        '.'
      )[0];
    history.push('/jdResult/' + url);

    console.log(url);
  };

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      //   body: JSON.stringify({
      //     recruiter: currentUser.email.replace(".", ""),
      //     job_description_ID: "1673739438255-JD1",
      //   }),
    };

    fetch('http://localhost:5000/api/prevJDs', requestOptions)
      .then(res => res.json())
      .then(data => {
        let jdData = [];
        for (const [key, value] of Object.entries(data['data'])) {
          let temp = {};
          temp.id = key;
          temp.fullName = key + '.pdf';
          temp.email = currentUser.email;
          temp.description = value.description;
          temp.uploadPath = value.path;
          jdData.push(temp);
        }

        setRecords(jdData);
      })
      .catch(err => console.log(err));
  }, []);

  console.log(records);

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value == '') return items;
        else
          return items.filter(x =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const openInPopup = item => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      {modalOpen && <Jdmodal setOpenModal={setModalOpen} jdData={records[0]} />}
      <PageHeader
        title="Job Descriptions"
        icon={<DescriptionIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search"
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
        </Toolbar>
        <TblContainer className={classes.root}>
          <TblHead styles={{ fontSize: '4rem' }} />
          <TableBody styles={{ fontSize: '4rem' }}>
            {recordsAfterPagingAndSorting().map(item => (
              <TableRow key={item.id}>
                <TableCell styles={{ fontSize: 34 }}>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    color="primary"
                    // onClick={() => {
                    //   openInPopup(item);
                    // }}
                  >
                    <CloudDownloadIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="primary"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    <InfoIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    color="primary"
                    onClick={handleRedirect}
                  >
                    <PageviewSharpIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
