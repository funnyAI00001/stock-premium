import React, { useEffect, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { Typography, Grid, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import {
  setSelectedSymbolsForCalculation,
  setSelectedSymbolsForPut,
  getStocks,
  getCategory,
} from "../actions/stockAction";

import AddCategory from "../components/category/addCategory";
import CustomAlert from "../components/customAlert";
import EditCategory from "../components/category/editCategory";
import SelectCallOrPut from "../components/dialog/selectCallOrPut";
import UpgradeFreeAccount from "../components/dialog/upgradeFreeAccount";

const Shortlist = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth0();

  const [openEdit, setOpenEdit] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [openSelectCallorPut, setOpenSelectCallOrPut] = useState(false);

  const categories = useSelector((state) => state.stock.categories);
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const [openUpgradeFreeAccountDialog, setOpenUpgradeFreeAccountDialog] =
    useState(false);
  const [symbols, setSymbols] = useState([]);
  const isSmScreen = useMediaQuery("(min-width:600px)");

  const onEdit = (index) => {
    if (subscriptionStatus === "trial_expired" && index >= 2) {
      // setAlertText(
      //   <span>
      //     Too many short lists for a free account. Please consider upgrading to
      //     use up 10 shortlists.{" "}
      //     <a href="/stripe" style={{ color: "white" }}>
      //       {" "}
      //       Upgrade now!{" "}
      //     </a>
      //   </span>
      // );
      // setOpenAlert(true);
      setOpenUpgradeFreeAccountDialog(true);

      return;
    }
    setOpenEdit(true);
  };

  const onClose = () => {
    setOpenEdit(false);
  };

  const onCancel = () => {
    setOpenEdit(false);
  };

  const onAddCategory = () => {
    if (subscriptionStatus === "trial_expired") {
      if (categories.length >= 2) {
        setOpenUpgradeFreeAccountDialog(true);

        return;
      }
    } else {
      if (categories.length >= 10) {
        setAlertText("Each user can have ten categories at max!");
        setOpenAlert(true);
        return;
      }
    }

    setOpenAddCategory(true);
  };

  const onCalculate = (category, index) => {
    if (index >= 2 && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);

      return;
    } else if (
      category.symbols.length > 3 &&
      subscriptionStatus === "trial_expired"
    ) {
      setOpenUpgradeFreeAccountDialog(true);
      
      return;
    }

    setOpenSelectCallOrPut(true);
    setSymbols(category.symbols);
  };

  const onCallSelected = () => {
    const data = { symbols: symbols };
    dispatch(setSelectedSymbolsForCalculation(data));
    navigate("/earn");
  };

  const onPutSelected = () => {
    const data = { symbols: symbols };
    dispatch(setSelectedSymbolsForPut(data));
    navigate("/cashSecuredPuts");
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
                {category.symbols.map((item, index2) => (
                  <Button key={index2}>{item}</Button>
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
                      onCalculate(category, index);
                    }}
                  >
                    Calculate
                  </Button>
                  <Button
                    startIcon={<EditNoteIcon />}
                    sx={{ width: "22% !important", marginLeft: 1 }}
                    onClick={() => {
                      onEdit(index);
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
        text={alertText}
        openState={openAlert}
        severity="warning"
        autoHideDuration={5000}
        onClose={() => setOpenAlert(false)}
      />
      <SelectCallOrPut
        open={openSelectCallorPut}
        text="Which side?"
        onPut={onPutSelected}
        onCall={onCallSelected}
        onClose={() => setOpenSelectCallOrPut(false)}
      />

      <UpgradeFreeAccount
        open={openUpgradeFreeAccountDialog}
        onClose={() => {
          setOpenUpgradeFreeAccountDialog(false);
        }}
      />
    </div>
  );
};

export default Shortlist;
