import React from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        avatar: '',
        name: '',
      }
    };

    const firebaseConfig = {
  apiKey: "AIzaSyBzovDgminALHPBLlqWDZ8wTV8gN4Be5Ag",
  authDomain: "chatapp-8f296.firebaseapp.com",
  projectId: "chatapp-8f296",
  storageBucket: "chatapp-8f296.appspot.com",
  messagingSenderId: "650424371015",
  appId: "1:650424371015:web:ea5a4027120c9c031e2e62",
  measurementId: "G-RXWED806KK"
};
if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
  }
  this.referenceChatMessages = firebase.firestore().collection("messages");
  }
  
  componentDidMount() {
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
     if (!user) {
       firebase.auth().signInAnonymously();
     }
     this.setState({
       uid: user.uid,
       messages: [],
     });
     this.referenceChatMessages = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
     this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);
   });
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.collectionUpdate);
  }

  addMessages = (message) => {

        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: message.user,
        });
    }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get query document snapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
  }

  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  };

 onSend(messages = []) {
  this.setState((previousState) => ({
    messages: GiftedChat.append(previousState.messages, messages),
  }),() => {
    this.addMessages();
    this.saveMessages();
  });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});