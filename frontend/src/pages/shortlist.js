import React, { useEffect, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { Typography, Grid, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { getCategory } from "../actions/stockAction";
import {
  setSelectedSymbolsForCalcuation,
  getStocks,
} from "../actions/stockAction";

import AddCategory from "../components/category/addCategory";
import CustomAlert from "../components/customAlert";
import EditCategory from "../components/category/editCategory";

const Shortlist = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth0();

  const [openEdit, setOpenEdit] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState([]);
  const [openMaxCategoriesCountAlert, setOpenMaxCategoriesCountAlert] =
    useState(false);

  const categories = useSelector((state) => state.stock.categories);
  const isSmScreen = useMediaQuery("(min-width:600px)");

  const onEdit = () => {
    setOpenEdit(true);
  };

  const onClose = () => {
    setOpenEdit(false);
  };

  const onCancel = () => {
    setOpenEdit(false);
  };

  const onAddCategory = () => {
    if (categories.length >= 10) {
      setOpenMaxCategoriesCountAlert(true);
      return;
    }

    setOpenAddCategory(true);
  };

  useEffect(() => {
    dispatch(getCategory({ user }));
    dispatch(getStocks());
  }, [dispatch, user]);

  return (
    <div style={isSmScreen ? { padding: 50 } : {}}>
      <Typography variant="h5" marginTop={isSmScreen ? 0 : 5}>
        My Shortlist
      </Typography>
      {!openEdit && (
        <Grid container mt={5} spacing={0}>
          <Grid md={3} item></Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              "& .MuiButtonBase-root": {
                color: "white !important",
                border: "solid 1px",
                borderColor: theme.palette.text.third,
                width: "50%",
              },
            }}
          >
            {categories.map((category, index) => (
              <fieldset
                key={index}
                style={{
                  borderColor: theme.palette.text.third,
                  borderRadius: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 30,
                  padding: 25,
                  marginBottom: 15,
                }}
              >
                <legend>{category.name}</legend>
                {category.symbols.map((item, index) => (
                  <Button key={index}>{item}</Button>
                ))}
                <div style={{ display: "flex", width: "100%" }}>
                  <Button
                    sx={{
                      backgroundColor: theme.palette.text.third,
                      marginLeft: "25%",
                      width: "50%",
                    }}
                    disabled={category.symbols.length === 0}
                    onClick={() => {
                      const data = { symbols: category.symbols };
                      dispatch(setSelectedSymbolsForCalcuation(data));
                      navigate("/earn");
                    }}
                  >
                    Calculate
                  </Button>
                  <Button
                    startIcon={<EditNoteIcon />}
                    sx={{ width: "22% !important", marginLeft: 1 }}
                    onClick={() => {
                      onEdit();
                      setSelectedCategory(category.name);
                      setSelectedSymbol(category.symbols);
                    }}
                  >
                    Edit
                  </Button>
                </div>{" "}
              </fieldset>
            ))}
            <div style={{ textAlign: "center" }}>
              <Button onClick={() => onAddCategory()}>
                <AddCircleIcon sx={{ marginRight: 1 }} /> Add Category
              </Button>
            </div>
          </Grid>
        </Grid>
      )}
      {openEdit && (
        <Grid container>
          <Grid item sm={3}></Grid>
          <Grid item xs={12} sm={6}>
            <EditCategory
              onClose={onClose}
              onCancel={onCancel}
              name={selectedCategory}
              parentSymbols={selectedSymbol}
              user={user}
              onSave={() => setOpenEdit(false)}
            />
          </Grid>
        </Grid>
      )}

      <AddCategory
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
      />
      <CustomAlert
        text="Each user can have ten categories at max!"
        openState={openMaxCategoriesCountAlert}
        severity="warning"
        onClose={() => setOpenMaxCategoriesCountAlert(false)}
      />
    </div>
  );
};

export default Shortlist;
