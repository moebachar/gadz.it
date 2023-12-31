import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Joi from "joi-browser";
import Button2 from "../commun/button2";
import "./adminConsole.scss";
import { ADMIN_PASSWORD, CELLS } from "../../utils/constants";
import { validate } from "../../utils/validation";

//MUI
import { Button, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

//Firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { app, db } from "../../configs/firebaseConfig";
import { useAuth } from "../../utils/authContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const schema = {
  displayName: Joi.string().min(4).required().label("Full Name"),
  email: Joi.string().email().required().label("E-mail"),
  password: Joi.string().min(4).max(16).required().label("Password"),
  cell: Joi.string().required().label("Cell"),
};

function AdminConsole() {
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState(null);
  const [cell, setCell] = useState("Event");
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [key, setKey] = useState("");
  const [numberOfJoinedUsers, setNumberOfJoinedUsers] = useState(0);
  const [workshop_orders, setWorkshops_order] = useState([]);
  const [joined_users, setJoinedUsers] = useState([]);

  useEffect(() => {
    const getAdmin = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const mappedUsers = querySnapshot.docs.map((doc) => {
        return { uid: doc.id, ...doc.data() };
      });
      setUsers(mappedUsers);
      const ju = await getDocs(collection(db, "joined_users"));
      setNumberOfJoinedUsers(ju.size);
      const joined = ju.docs.map((doc) => {
        return { ...doc.data() };
      });
      setJoinedUsers(joined);
      const ws = await getDocs(collection(db, "workshops_orders"));
      setWorkshops_order(
        ws.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    };

    getAdmin();
  }, []);

  const countWorkshops = () => {
    let python = 0;
    let c = 0;
    let web = 0;

    for (let order of workshop_orders) {
      let workshops = order.workshops; // Assuming each order has a property named workshops

      for (let workshop of workshops) {
        if (workshop === "Python") {
          python++;
        } else if (workshop === "C++") {
          c++;
        } else if (workshop === "Web Dev") {
          web++;
        }
      }
    }

    return { c: c, python: python, web: web };
  };

  const onSubmit = async (data) => {
    data["cell"] = cell;
    const err = validate(data, schema);
    data["addBy"] = "E97cmIp5pePtVaLtsq33laUr6kf2";
    data["subAdmin"] = false;
    data["admin"] = false;
    data["facebook"] = "";
    data["linkedin"] = "";
    data["instagram"] = "";
    data["role"] = "Member";
    data["description"] = "Hi there! i am a Gadz'IT member";
    data["bureau"] = false;
    setError(err);
    console.log(err);
    if (!err) {
      setUsersList([...usersList, data]);
    }
  };

  const pushUsers = async (list) => {
    console.log(list);
    const succesAdded = [];
    setLoading(true);
    for (let user of list) {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, user.email, user.password)
        .then(async (userCredentail) => {
          const { password, ...data } = user;
          await setDoc(doc(db, "users", userCredentail.user.uid), data)
            .then(() => {
              succesAdded.push(user.displayName);
            })
            .catch((error) => {
              deleteUser(userCredentail.user);
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setUsersList([]);
    setAddedUsers([...addedUsers, ...succesAdded]);
    setLoading(false);
  };

  function convertToCSV(data) {
    // Ensure the input is not empty
    if (data.length === 0) {
      console.error("Input data is empty.");
      return;
    }

    // Extract column headers (keys) from the first object
    const columns = Object.keys(data[0]);

    // Create a CSV string
    const csvContent =
      columns.join(",") +
      "\n" +
      data
        .map((item) =>
          columns
            .map((col) => {
              // If the value is an array, concatenate into a space-separated string
              const value = Array.isArray(item[col])
                ? item[col].join(" ")
                : item[col];
              return value;
            })
            .join(",")
        )
        .join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.csv";

    // Append the link to the document and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  }

  const { c, python, web } = countWorkshops();
  if (key === ADMIN_PASSWORD)
    return (
      <div className="console">
        <div className="console__add-user">
          <div className="console__add-user__title">Add Member</div>
          <form
            className="console__add-user__form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              error={error ? (error.displayName ? true : false) : false}
              id="outlined-error-helper-text"
              label="Full Name"
              variant="outlined"
              {...register("displayName")}
              helperText={error ? error.displayName : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <DriveFileRenameOutlineIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Cell</InputLabel>
              <Select
                inputProps={{ "aria-label": "Without label" }}
                value={cell}
                label="Target"
                onChange={(event) => {
                  setCell(event.target.value);
                }}
                fullWidth
              >
                {CELLS.map(({ name, image }, index) => (
                  <MenuItem value={name} key={index}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={require(`../../assets/logo/${image}.ico`)}
                      ></Avatar>
                      <span>{name}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              error={error ? (error.email ? true : false) : false}
              id="outlined-error-helper-text"
              label="E-mail"
              variant="outlined"
              {...register("email")}
              helperText={error ? error.email : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <TextField
              error={error ? (error.password ? true : false) : false}
              id="outlined-error-helper-text"
              label="Password"
              variant="outlined"
              {...register("password")}
              helperText={error ? error.password : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VisibilityIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            {responseError && <Alert severity="error">{responseError}</Alert>}
            {loading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button2 type="submit" label="Add" />
            )}
          </form>
          <TableContainer sx={{ marginTop: 10 }} component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Display Name</StyledTableCell>
                  <StyledTableCell align="right">Cell</StyledTableCell>
                  <StyledTableCell align="right">Email</StyledTableCell>
                  <StyledTableCell align="right">Password</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {row.displayName}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.cell}</StyledTableCell>
                    <StyledTableCell align="right">{row.email}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.password}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button onClick={() => pushUsers(usersList)}>Push Users</Button>
            )}
          </TableContainer>
          <div>
            <p>
              You added <strong>{addedUsers.length}</strong> members
            </p>
            <ul>
              {addedUsers.map((user, index) => (
                <li key={index}>{user}s</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="console__manage-users">
          <div className="console__add-user__title">Manage Members</div>
          <div className="console__joined_users">
            {`number of joined users ${numberOfJoinedUsers}`}{" "}
            <button type="button" onClick={() => convertToCSV(joined_users)}>
              download users
            </button>
          </div>
          <div className="console__workshops">
            {`C++ : ${c} \n Python : ${python} \n Web Dev : ${web}`}
            <button type="button" onClick={() => convertToCSV(workshop_orders)}>
              download orders
            </button>
          </div>
        </div>
      </div>
    );
  else {
    return (
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="admin key..."
        type="password"
      />
    );
  }
}

export default AdminConsole;
