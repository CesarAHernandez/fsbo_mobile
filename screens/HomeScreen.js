import React, { useState } from "react";
import {
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text
} from "react-native";

import { connect } from "react-redux";
import { removeUserToken } from "../actions";

function HomeScreen({ navigation, token, removeUserToken }) {
  const [error, setError] = useState(null);

  return (
    <View style={styles.contatiner}>
      <Text>
        This is the Home screen if you want to go to the phase click here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return {
    token: state.token.token
  };
};

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeUserToken())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
