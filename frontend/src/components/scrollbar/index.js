import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Box, useTheme } from "@mui/material";
import { connect } from "react-redux";

const Scrollbar = ({ className, children, selectedUserName, chatContents, ...rest }) => {
  const theme = useTheme();
  const scrollbarsRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when children or content changes
    if (scrollbarsRef.current !== null) {
      setTimeout(() => {
        scrollbarsRef.current && scrollbarsRef.current.scrollToBottom();
      }, 1000);
    }
  }, [children, selectedUserName, chatContents]);

  return (
    <Scrollbars
      autoHide
      renderThumbVertical={() => (
        <Box
          sx={{
            width: 5,
            background: `${theme.colors.alpha.black[10]}`,
            borderRadius: `${theme.general.borderRadiusLg}`,
            transition: `${theme.transitions.create(["background"])}`,
            "&:hover": {
              background: `${theme.colors.alpha.black[30]}`,
            },
          }}
        />
      )}
      ref={scrollbarsRef}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const mapStateToProps = (state) => ({
  selectedUserName: state.chat.selectedUserName,
  chatContents: state.chat.chatContents,
});

export default connect(mapStateToProps)(Scrollbar);
