import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const Logo = (props) => (
  <Svg
    width={57}
    height={51}
    viewBox="0 0 57 51"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={57} height={51} rx={12} fill="#17CFB0" fillOpacity={0.2} />
    <Path
      d="M42 33V22.65L28.5 30L12 21L28.5 12L45 21V33H42ZM28.5 39L18 33.3V25.8L28.5 31.5L39 25.8V33.3L28.5 39Z"
      fill="#17CFB0"
    />
  </Svg>
);
export default Logo;
