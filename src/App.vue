<template>
  <!-- <div v-for="message in messages" :key="message.key">
    <p>{{message.username}}</p>
    <h3>{{message.content}}</h3>
  </div> -->
  <div v-if="currentMenu === 'register'">
    <form @submit.prevent="register()">
      <input placeholder="Type your username..." v-model="username">
      <button>register</button>
      <br>
      <button @click="skip()">Skip</button>
    </form>
  </div>

  <div v-if="currentMenu === 'menu'">
    <h5>Welcome, {{username}}</h5>
    <button @click="currentMenu = 'online'">play online</button>
    <button @click="localProcess()" >play against CPUs</button>
    
  </div>

  <div v-if="currentMenu === 'local'">

    <div v-if="localMenu === 'rule'">
      Are you ready, {{username}}?
      <hr>
      <!-- decide the number of players -->
      <h4>Number of players(4-10)</h4>
      <input type="number" v-model="numOfPlayer">
      <hr>
      <!-- decide the role -->

    </div>
    
  </div>



</template>

<script>
import db from './db';
import 'firebase/firestore';

export default {
  data(){
    return {
      messages: null,
      currentMenu: 'register',
      localMenu: 'rule',
      username: '',

      numOfPlayer: 4,
    }
  },
  methods:{
    refresh(){
			db.database().ref('messages').on('value', snapshot => {
				const data = snapshot.val();
				let messages = [];

				Object.keys(data).forEach(key => {
					messages.push({
						id: key,
						username: data[key].username,
						content: data[key].content,
            avatar: data[key].avatar,
					});
				});
				this.messages = messages;
			});
		},

    skip(){
      this.currentMenu= 'local'
      this.username = 'hectoer'
    },


    register(){
      if(this.username === '' || this.username === null){
        alert('Please type your name')
        return
      }
      
      this.currentMenu ='menu'
    },

    localProcess(){
      this.currentMenu = 'local'
    }
  },

  mounted(){
    // this.refresh()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
