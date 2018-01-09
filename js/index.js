import '../sass/index.scss';
import pathToAvatarA from '../images/avatar-a.png';
import pathToAvatarB from '../images/avatar-b.png';

// Cache all DOM elements
var chatForm = document.querySelectorAll('.chat-input-area');
var chatInputField = document.querySelectorAll('.chat-input-area__input');
var chatLog = document.querySelectorAll('.chat-log');
// Global loading indicator
var loading = false;
// Get Dialogflow access key from the environment variable
var accessKey = process.env.KEY;

/**
 * Scrolls the contents of a container to the bottom
 * @function scrollContents 
*/
function scrollContents(container) {
  container.scrollTop = container.scrollHeight;
}

/**
 * Create a DOM element from a string value
 * @function getMessageElement 
 * @param {string} val
 * @param {boolean} isUser
 * @returns {HTMLElement}
*/
function getMessageElement(val, isUser) {
  // Create parent message element to append all inner elements
  var newMessage = document.createElement('div');
  
  // Add message variation class when the message belongs to the user
  if (isUser) {
    newMessage.className += 'chat-message--right ';
  }

  // Create avatar
  var avatarFrame = document.createElement('span');
  avatarFrame.className += 'chat-message__avatar-frame';
  var avatar = document.createElement('img');
  avatar.src = isUser ? pathToAvatarA : pathToAvatarB;
  avatar.alt = 'avatar';
  avatar.className += 'chat-message__avatar';

  // Create text
  var text = document.createElement('p');
  text.append(val);
  text.className += 'chat-message__text';

  // Append elements
  avatarFrame.append(avatar);
  newMessage.append(avatarFrame);
  newMessage.append(text);
  newMessage.className += 'chat-message ';

  return newMessage;
}

/**
 * Requests a reply from dialogflow.com
 * @function getReply 
 * @param {string} input
*/
function getReply(input) {
  loading = true;

  // There is no access key set
  // Continue with a hardcoded message
  if (!accessKey) {
    onGetReplySuccess('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
    return false;
  }

  // There is an access key set
  // Make a call to Dialogflow
  var options = {
    method: 'POST', 
    mode: 'cors', 
    headers:  new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${accessKey}`,
    }),
    body: JSON.stringify({
      'query': input,
      'lang': 'en',
      'sessionId': '1234567890'
    })
  };

  fetch('https://api.api.ai/v1/query?v=20150910', options)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      return response.json();
    })
    .then(onGetReplySuccess)
    .catch(onGetReplyError)
}

/**
 * Handles what happens when getReply succeeds
 * @function onGetReplySuccess 
 * @param {Object|String} data
*/
function onGetReplySuccess(data) {
  var newMessage = typeof data === 'string' ?
    getMessageElement(data, false) :
    getMessageElement(data.result.fulfillment.speech, false);

  // Scroll to last message
  chatLog[0].append(newMessage);
  scrollContents(chatLog[0]);
  loading = false;
}

/**
 * Handles what happens when getReply fails
 * @function onGetReplyError 
*/
function onGetReplyError() {
  var newMessage = getMessageElement('Oh no, there has been an error');

  // Scroll to last message
  chatLog[0].append(newMessage);
  scrollContents(chatLog[0]);
  loading = false;
}

// Handle form submit (clicking on the submit button or pressing Enter)
chatForm[0].addEventListener('submit', function(e) {
  e.preventDefault();

  // If reply is loading, wait
  if (loading) {
    return false;
  }

  // Catch empty messages
  if (!chatInputField[0].value) {
    return false;
  }

  // Add user's message to the chat log
  var newMessage = getMessageElement(chatInputField[0].value, true);
  chatLog[0].append(newMessage);

  // Scroll to last message
  scrollContents(chatLog[0]);

  // Get the reply from dialogflow.com
  getReply(chatInputField[0].value);

  // Clear input
  chatInputField[0].value = '';
});
