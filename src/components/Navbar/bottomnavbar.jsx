import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LoginIcon from '@mui/icons-material/AccountCircleOutlined';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="bottom-nav">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Explore" icon={<ExploreIcon />}/>
        <BottomNavigationAction label="Wishlist" icon={<FavoriteBorderIcon />} />
        <BottomNavigationAction label="Login" icon={<LoginIcon />} />
      </BottomNavigation>
    </div>
  );
}
