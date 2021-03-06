<template>


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
    <button @click="currentMenu = 'online'">Play online</button>
    <button @click="localProcess()" >Play with one device</button>
    
  </div>

  <div v-if="currentMenu === 'local'">

    <div v-if="localMenu === 'rule'">
      Are you ready, {{username}}?
      <hr>
      <div>
        <!-- decide the number of players -->
        <p>Number of players(4-10)</p>
        <input type="number" v-model="numOfPlayer" style="width:10%; margin-right: auto;
        margin-left: auto; text-align:center">
      </div>
      
      <hr>
      <div class='roleselection'>
        <div class='container' v-for="(role,i) in rolesList.default" :key="i">
          <!-- default roles  -->
          <div v-if="i<10" >
            <img :src="role.imgLink"  style="width: 75px; margin-top:5px">
            <span>{{role.name}}</span>
          </div>
        </div>
      </div>

      <!-- decide the role -->

    </div>
    
  </div>



</template>

<script>
import db from './db';
import 'firebase/firestore';
import { rolesList } from './const/roles.js'

export default {
  data(){
    return {
      messages: null,
      currentMenu: 'register',
      localMenu: 'rule',
      username: '',
      
      rolesList,

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
      this.numOfPlayer = 7

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
    },
  },

  mounted(){
    // this.refresh()
    console.log(this.rolesList)
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
  margin-top: 40px;
}
.container{
  /* display: flex; */
}

.container div {
  float: left;
  /* display: flex; */
  font-size: 60%;
  /* position: absolute; */
  width: 22%;
  /* top: 20px; */
  height:100px;
  /* margin-top: 50px; */
  /* width: 60em; */
  /* background-color: #304455; */
  border: solid 1px black;
  margin-right: 1%;
  margin-left: 1%;
  margin-bottom: 3%;
   position: relative;
}
.container div span{
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  color: red
}


</style>
