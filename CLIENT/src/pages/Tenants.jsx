import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Paper, Typography, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Tabs, Tab, Button, Modal } from "@mui/material";
import { fetchAllUsers, createUser, updateUser } from "../features/users/UserSlice";
import UserForm from "../components/UserForm"

export default function Tenants() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.users);
  const user = useSelector((state) => state.auth.user);

  const [tab, setTab] = useState(0); // 0 = דיירים, 1 = מנהלים

  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState(null);   // null = יצירה, object = עריכה

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (loading) return (<CircularProgress />);

  const tenants = list.filter(u => u.role === "tenant");
  const admins = list.filter(u => u.role === "admin");

  const visibleTenants =
    user.role === "admin"
      ? tenants
      : tenants.filter(t => t.isActive);

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
  const handleFormSubmit = (data) => {
    if (editUser) {
      dispatch(updateUser({ id: editUser._id, updatedFields: data }));
    } else {
      dispatch(createUser(data));
    }

    setOpenForm(false);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>ניהול דיירים</Typography>

      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="דיירים" />
        <Tab label="מנהלים" />
      </Tabs>

      {user.role === "admin" && (
        <Button
          variant="contained" color="primary" sx={{ my: 2 }}
          onClick={openCreateForm}
        >
          הוסף דייר חדש
        </Button>
      )}

      <Table sx={{ direction: "rtl", "& td, & th": { textAlign: "center" } }}>
        <TableHead>
          <TableRow>
            <TableCell>שם</TableCell>
            <TableCell>דירה</TableCell>
            <TableCell>אימייל</TableCell>
            <TableCell>טלפון</TableCell>
            <TableCell>פעולה</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(tab === 0 ? visibleTenants : admins).map((u) => (
            <TableRow key={u._id}>
              <TableCell>{u.fullName}</TableCell>
              <TableCell>{u.apartmentNumber}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone}</TableCell>
              <TableCell>
                {(user.role === "admin" || user._id === u._id) && (
                  <Button
                    variant="outlined" size="small"
                    onClick={() => openEditForm(u)}
                  >
                    ערוך
                  </Button>
                )}
              </TableCell>
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
          />
        </Box>
      </Modal>

    </Paper>
  );
}
