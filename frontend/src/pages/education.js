import React, { useEffect } from "react";
import { Box } from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { increasePageClickCount } from "../actions/adminAction";

import LoadingOverlay from "../components/dialog/loadingOverlay";

const Education = () => {
  const userType = useSelector((state) => state.stripe.userType);
  const dispatch = useDispatch();
  const { isLoading } = useAuth0();

  useEffect(() => {
    // increase page click count

    dispatch(
      increasePageClickCount({
        page: "Education",
        userType: userType === null ? "Unknown" : userType,
      })
    );
  }, [dispatch, userType]);

  if (isLoading) {
    return <LoadingOverlay text="Loading..." color="success" />;
  }

  return (
    <Box
      minHeight={600}
      textAlign="center"
      fontSize={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="text.third"
    >
      Coming Soon!
    </Box>
  );
};

export default Education;
