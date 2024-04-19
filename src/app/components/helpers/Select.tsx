import * as React from "react";
import { Typography, Box, MenuItem, FormControl, Select } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";

interface Option {
  label: string;
  type: string;
}

interface Props {
  title: string;
  options: Record<string, Option>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

function BasicSelect({ title, options, value, setValue }: Props): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
  };

  const handleOpenClose = () => {
    setOpen(!open);
  };

  const convertToHyphenatedFormat = (str: string) => str.toLowerCase().split(" ").join("-");

  return (
    <Box className={convertToHyphenatedFormat(title)} sx={{ mb: "16px" }}>
      <FormControl fullWidth>
        <Typography
          sx={{
            fontSize: "14px",
            color: "black",
            mb: "6px",
            letterSpacing: "-0.5px",
            fontWeight: "500",
          }}
        >
          {title}
        </Typography>
        <Select
          displayEmpty
          value={value}
          onChange={handleChange}
          IconComponent={() => (
            <KeyboardArrowDownIcon
              onClick={handleOpenClose}
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                cursor: "pointer",
                mr: "10px",
              }}
            />
          )}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          sx={{
            borderRadius: "8px",
            border: "1px solid #e5e5e5",
            color: "#737373",
            padding: "0",
            bgcolor: "#fff",
            fontSize: "16px",
            maxHeight: "44px",
            height: "100%",
            boxShadow: "0 2px 15px -10px rgba(0,0,0,0.25)",
            ">div": {
              p: "10px 14px",
            },
            ">fieldset": {
              border: "0",
            },
          }}
          MenuProps={{
            style: {
              maxHeight: 400,
            },
          }}
        >
          {options &&
            Object.entries(options).map(([key, { label }], index) => (
              <MenuItem
                key={key}
                sx={{
                  fontSize: "16px",
                  letterSpacing: "-0.5px",
                }}
                value={key}
              >
                {label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default BasicSelect;
