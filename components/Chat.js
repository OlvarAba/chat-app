import React, { Component } from "react";
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }
  
  componentDidMount() {
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: "You Have Entered Chat",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  

 onSend(messages = []) {
   this.setState(previousState => ({
     messages: GiftedChat.append(previousState.messages, messages),
   }))
 }

 renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
         left: {
          backgroundColor: '#DC143B'
        },
        right: {
          backgroundColor: '#BD20B3'
        },
      }}
    />
  );
}

  render() {
    const { color } = this.props.route.params;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
        renderbubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   chatContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
// });