import React from "react";
import {
  AsyncStorage,
  Button,
  StatusBar,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  StyleSheet,
  View,
  Text
} from "react-native";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";

// import Icon from "react-native-vector-icons/FontAwesome";

const SingleLead = ({ leadInfo, removeItem, movePhase, currentPhase }) => {
  const leadXPos = new Animated.Value(0);
  const nextPhaseOpacity = new Animated.Value(0);
  const archiveOpacity = new Animated.Value(0);

  const leadPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gs) => {
      //   console.log(gs.dy, gs.dx, gs.dy > 0 ? gs.dy < 0.2 : gs.dy > -0.2);

      return gs.dy === 0 && gs.dx !== 0;
    },
    onPanResponderMove: (evt, gs) => {
      const width = Dimensions.get("window").width;
      //Values for the lead container position
      const leftThreshold = -1 * width * 0.5;
      const rightThreshold = width * 0.5;
      if (gs.dx > leftThreshold && gs.dx < rightThreshold) {
        leadXPos.setValue(gs.dx);
      }
      //Values for the option opacity
      nextPhaseOpacity.setValue(gs.dx / rightThreshold);
      archiveOpacity.setValue(gs.dx / leftThreshold);
    },
    onPanResponderEnd: (evt, gs) => {
      const width = Dimensions.get("window").width;
      const leftThreshold = -1 * width * 0.47;
      const rightThreshold = width * 0.47;
      if (gs.dx < leftThreshold || gs.dx > rightThreshold) {
        const swipeDirection = gs.dx < -1 * width * 0.47 ? "left" : "right";
        //Swipe left
        Animated.timing(leadXPos, {
          toValue: swipeDirection === "left" ? -1 * width : 1 * width,
          duration: 250
        }).start();
        if (swipeDirection === "left") {
          movePhase(0, leadInfo.id);
          console.log("Archive");
          setTimeout(() => {
            removeItem(leadInfo.id);
          }, 500);
        } else {
          movePhase(currentPhase + 1, leadInfo.id);
          setTimeout(() => {
            removeItem(leadInfo.id);
          }, 500);
          console.log("Next Phase");
        }
      } else {
        Animated.timing(leadXPos, {
          toValue: 0,
          duration: 250
        }).start();
        Animated.timing(nextPhaseOpacity, {
          toValue: 0,
          duration: 250
        }).start();
        Animated.timing(archiveOpacity, {
          toValue: 0,
          duration: 250
        }).start();
      }
    }
  });

  const _handleCall = () => {
    const phoneNumber = leadInfo.phone.replace(/-/g, "");
    console.log(leadInfo.phone, phoneNumber);
    try {
      RNImmediatePhoneCall.immediatePhoneCall("1234567890");
    } catch (e) {
      // Make a toast with an error
      console.log(e);
    }
  };
  const _handleNotes = () => {
    console.log("You are accessing the notes of someone");
  };
  return (
    <View style={styles.outerContainer}>
      <Animated.View
        {...leadPanResponder.panHandlers}
        style={[styles.container, { left: leadXPos }]}
      >
        <View style={styles.left}>
          <View style={styles.userInfo}>
            <Text>{leadInfo.firstName}</Text>
            <Text>{leadInfo.lastName}</Text>
          </View>

          {/* <TouchableOpacity>
            <Icon
              style={styles.notes}
              onPress={_handleNotes}
              name="sticky-note"
              size={30}
              color="#900"
            />
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity onPress={_handleCall} style={styles.contactInfo}>
          <Text>{leadInfo.phone}</Text>
          {/* <Icon style={styles.phone} name="phone" size={30} color="#900" /> */}
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.options}>
        <Animated.Text
          style={[
            styles.nextPhase,
            styles.option,
            { opacity: nextPhaseOpacity }
          ]}
        >
          Next Phase
        </Animated.Text>
        <Animated.Text
          style={[styles.archive, styles.option, { opacity: archiveOpacity }]}
        >
          Archive
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%"
  },
  container: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    justifyContent: "space-between",
    width: "100%",
    height: 75,
    position: "relative",
    backgroundColor: "white",
    zIndex: 10
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  options: {
    zIndex: 0,
    flex: 1,
    width: "100%",
    height: "86%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute"
  },
  option: {
    width: "40%",
    height: "100%",
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "700",
    fontSize: 20
  },
  nextPhase: {
    backgroundColor: "#00b200"
  },
  archive: {
    backgroundColor: "#f83b3a"
  }
});
export default SingleLead;
