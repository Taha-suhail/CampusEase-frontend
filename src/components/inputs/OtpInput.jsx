import { StyleSheet, TextInput, View } from "react-native";
import React, { useCallback, useRef } from "react";
import { s, vs } from "react-native-size-matters";

const OtpInput = ({ value, onChangeText }) => {
  // const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputs = useRef([]);

  const handleOTPChange = (index, val) => {
    const newOtp = [...value];
    newOtp[index] = val;
    onChangeText(newOtp);
    // Auto-focus next input
    if (val && index < value.length - 1) {
      otpInputs.current[index + 1]?.focus();
    } else if (!val && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };
  const setInputRef = useCallback(
    (index) => (ref) => {
      otpInputs.current[index] = ref;
    },
    [],
  );

  return (
    <View style={styles.row}>
      {value.map((d, i) => (
        <View key={i} style={styles.inputContainer}>
          <TextInput
            // key={i}
            placeholder=""
            style={styles.input}
            value={d}
            onChangeText={(text) => handleOTPChange(i, text)}
            keyboardType="numeric"
            maxLength={1}
            ref={setInputRef(i)}
            underlineColorAndroid="transparent"
            cursorColor="black"
            scrollEnabled={true}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
    paddingHorizontal: s(24),
    marginVertical: vs(32),
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginEnd: s(8),
    backgroundColor: "#000",
  },
  input: {
    textAlign: "center",
    // borderBottomWidth: 1.5,
    borderBottomColor: "#9ca3af", // border-gray-400
    width: "100%", // w-12
    height: vs(43), // h-12
    fontWeight: "800", // font-extrabold
    fontSize: s(15), // text-xl
    backgroundColor: "white",
    borderRadius: s(8), // rounded-lg
  },
});

export default OtpInput;
