import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { connect } from "react-redux";
import { saveUserToken } from "../actions";

import { LOGIN } from "../graphqlQueries";
import { graphqlFetch } from "../utils";

function LoginScreen({ navigation, saveUserToken }) {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const _signInAsync = () => {
    setError(null);
    graphqlFetch({ email, password }, "", LOGIN).then(({ errors, data }) => {
      if (!errors) {
        saveUserToken(JSON.stringify(data.user))
          .then(() => {
            navigation.navigate("App");
          })
          .catch(error => {
            setError(error);
          });
      } else {
        setError(errors);
      }
    });
  };
  const displayErrors = () => {
    return error.map((error, idx) => {
      return <Text key={idx}>{error.message}</Text>;
    });
  };
  return (
    <View style={styles.container}>
      <Text>This is the login screen</Text>
      {error ? displayErrors() : <Text />}
      <TextInput
        value={email}
        onChangeText={currentEmail => setEmail(currentEmail)}
        style={styles.input}
        placeholder={"Email"}
      />
      <TextInput
        value={password}
        onChangeText={currentPassword => setPassword(currentPassword)}
        secureTextEntry={true}
        style={styles.input}
        placeholder={"Password"}
      />
      <Button title="Sign in" onPress={_signInAsync} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10
  }
});

const mapStateToProps = state => ({
  token: state.token
});

const mapDispatchToProps = dispatch => ({
  saveUserToken: params => dispatch(saveUserToken(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
