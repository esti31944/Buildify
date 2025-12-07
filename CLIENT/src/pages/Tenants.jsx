import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Paper, Typography, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Tabs, Tab, Button, IconButton, Modal, Tooltip } from "@mui/material";
import { ToggleOnOutlined, ToggleOffOutlined } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TabLabel from "../components/TabLabel";
import { fetchAllUsers, createUser, updateUser, toggleUserActive } from "../features/users/UserSlice";
import UserForm from "../components/UserForm"

export default function Tenants() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.users);
  const user = useSelector((state) => state.auth.user);

  const [tab, setTab] = useState(0); // 0 = דיירים, 1 = מנהלים

  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState(null);   // null = יצירה, object = עריכה

  const [statusFilter, setStatusFilter] = useState("active");// all | active | inactive

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const tenants = list.filter(u => u.role === "tenant");
  const admins = list.filter(u => u.role === "admin");


  const visibleTenants =
    user.role === "admin"
      ? tenants
      : tenants.filter(t => t.isActive);

  const sortedTenants = [...visibleTenants].sort(
    (a, b) => Number(a.apartmentNumber || 0) - Number(b.apartmentNumber || 0)
  );

  const sortedAdmins = [...admins].sort(
    (a, b) => Number(a.apartmentNumber || 0) - Number(b.apartmentNumber || 0)
  );


  const filteredTenants = React.useMemo(() => {
    return sortedTenants.filter(u => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return u.isActive;
      if (statusFilter === "inactive") return !u.isActive;
      return true;
    });
  }, [sortedTenants, statusFilter]);

  const filteredAdmins = React.useMemo(() => {
    return sortedAdmins.filter(u => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return u.isActive;
      if (statusFilter === "inactive") return !u.isActive;
      return true;
    });
  }, [sortedAdmins, statusFilter]);



  if (loading) return (<CircularProgress />);

  const handleTabChange = (_, newValue) => setTab(newValue);

  // פתיחת טופס 
  const openCreateForm = () => {
    setEditUser(null);
    setOpenForm(true);
  };

  const openEditForm = (u) => {
    setEditUser(u);
    setOpenForm(true);
  };

  // טיפול בשליחת טופס 
  const handleFormSubmit = async (data) => {
    try {
      if (editUser) {
        await dispatch(updateUser({ id: editUser._id, updatedFields: data })).unwrap();
      } else {
        await dispatch(createUser(data)).unwrap();
      }
      // await dispatch(fetchAllUsersManage());
      setOpenForm(false);
    } catch (err) {
      alert(err.msg || "שגיאה בשמירת המשתמש");
    }
  };

  // const handleDeleteUser = async (id) => {
  //   if (!window.confirm("למחוק משתמש זה?")) return;

  //   try {
  //     await dispatch(deleteUser(id)).unwrap();
  //   } catch (err) {
  //     alert(err.msg || "לא ניתן למחוק את המשתמש");
  //   }
  // };

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>ניהול דיירים</Typography>

      {user.role === "admin" && (
        <Box sx={{width: "100%", display: "flex", justifyContent: "flex-end", mb: 2,pl: 8 }}>
          <Tooltip title="הוסף משתמש חדש">
            <IconButton
              variant="outlined"
              onClick={openCreateForm}
              sx={{ display: "flex", alignItems: "center", gap: 1, borderRadius: 3, borderColor: "#1976d2 !important", color: "#16acec", backgroundColor: "rgba(25, 118, 210, 0.05)", "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" } }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label={<TabLabel title="דיירים" count={filteredTenants.length} />} />
        <Tab label={<TabLabel title="מנהלים" count={filteredAdmins.length} />} />
      </Tabs>

      {user.role === "admin" && (
        <Box sx={{ my: 2, display: "flex", justifyContent: "flex-start", gap: 1 }}>

          <Button
            variant={statusFilter === "active" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("active")}
            sx={{
              ...(statusFilter === "active" && {
                backgroundColor: "#e0f7ea",
                color: "green",
              })
            }}
          >
            פעילים
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("inactive")}
            sx={{
              ...(statusFilter === "inactive" && {
                backgroundColor: "#ffecec",
                color: "#c80000",
              })
            }}
          >
            לא פעילים
          </Button>
          <Button
            variant={statusFilter === "all" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("all")}
            sx={{
              ...(statusFilter === "all" && {
                backgroundColor: "#d3e8fc",
                color: "#005aad",
              })
            }}
          >
            כולם
          </Button>
        </Box>
      )}


      <Table sx={{ direction: "rtl", "& td, & th": { textAlign: "center" } }}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>שם</TableCell>
            <TableCell>דירה</TableCell>
            <TableCell>אימייל</TableCell>
            <TableCell>טלפון</TableCell>
            <TableCell>ניהול</TableCell>
            {user.role === "admin" && (
              <TableCell>סטטוס</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {(tab === 0 ? filteredTenants : filteredAdmins).map((u, index) => (
            <TableRow key={u._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{u.fullName}</TableCell>
              <TableCell>{u.apartmentNumber}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone}</TableCell>
              <TableCell>
                {/* <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}> */}
                {(user.role === "admin" || user._id === u._id) && (
                  <Tooltip title="ערוך פרטי משתמש">
                    <IconButton
                      onClick={() => openEditForm(u)}
                      sx={{ opacity: 0.85 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* *13* */}
                {/* {user.role === "admin" && u.canDelete ? (
                    <IconButton
                      onClick={() => handleDeleteUser(u._id)}
                      title="מחק משתמש"
                      sx={{ opacity: 0.85 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <IconButton sx={{ opacity: 0, cursor: "default" }}>
                      <DeleteIcon />
                    </IconButton>
                  )} */}
                {/* </Box> */}
              </TableCell>

              {user.role === "admin" && (
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {u.isActive ? "פעיל" : "לא פעיל"}
                    </Typography>
                    <Button
                      onClick={() => dispatch(toggleUserActive(u._id))}
                      sx={{ minWidth: 0, p: 0 }}
                    >
                      {u.isActive ? (
                        <ToggleOnOutlined sx={{ color: "#7DDA58", opacity: 0.8 }} />
                      ) : (
                        <ToggleOffOutlined sx={{ color: "#FF8C8C", opacity: 0.9 }} />
                      )}
                    </Button>
                  </Box>
                </TableCell>
              )}

            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <Box sx={{
          background: "white",
          p: 3,
          borderRadius: 2,
          width: 350,
          mx: "auto",
          mt: 10
        }}>
          <UserForm
            mode={editUser ? "edit" : "create"}
            initialData={editUser || {}}
            isAdmin={user.role === "admin"}
            onSubmit={handleFormSubmit}
            onClose={() => setOpenForm(false)}
            allTenants={tenants}
            activeTenants={sortedTenants}
          />
        </Box>
      </Modal>

    </Paper>
  );
}
