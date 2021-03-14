<template>


  <div v-if="currentMenu === 'register'">
    <form @submit.prevent="register()">
      <input placeholder="Type your username..." v-model="username">
      <button>register</button>
      <br>
      <button @click="skip()">Skip</button>
      <button @click="oniSkip()">Oni skip </button>

      <!-- <p>{{rolesList.Village}}</p> -->
    </form>
  </div>

  <div v-if="currentMenu === 'menu'">
    <p>{{currentMenu}}</p>
    <h5>Welcome, {{username}}</h5>

    <button @click="currentMenu = 'online'">Play online</button>
    <button @click="localProcess()" >Play with one device</button>
    
  </div>

  <div v-if="currentMenu === 'local'">

    <div v-if="localMenu === 'role-Village' || localMenu === 'role-wolves' || localMenu === 'role-solo'">
      <span class='counter' :class="[localMenu === 'role-Village' ? 'selectedCounter' : '']">Village  {{availableList.counters.Village}}/18</span>
      <span class='counter' :class="[localMenu === 'role-wolves' ? 'selectedCounter' : '']">Werewolf {{availableList.counters.Werewolf}}/4</span>
      <span class='counter' :class="[localMenu === 'role-solo' ? 'selectedCounter' : '']">Solo {{availableList.counters.Solo}}/3</span>
      <!-- <button>Next</button> -->
      
      <hr>
      
      
      <div class='roleselection' v-if="localMenu === 'role-Village'">
        <span>Village</span>
        <button style="margin-bottom: 10px; margin-left: 10px" @click="localMenu='role-wolves'">Next</button>
        
        <div class='container' v-for="(role,i) in rolesList.Village" :key="i">
          <!-- Village roles  -->
          <div class='role-card' :class="[role.avialblity ? 'trueAva': 'falseAva']" @click="role.avialblity = !role.avialblity" >
            <img :src="role.imgLink"  style="width: 75px; margin-top:5px" v-if="role.name !=='Priest' && role.name !== 'Medium' && role.name !== 'Bodyguard' &&  role.name !== 'Grumpy Grandma'  ">
            <img :src="role.imgLink"  style="width: 60px; margin-top:5px" v-else>
            <span>{{role.name}}</span>
          </div>
        </div>
      </div>

      <div  class='roleselection' v-if="localMenu === 'role-wolves'">
        <button style="margin-bottom: 10px; margin-right: 10px" @click="localMenu='role-Village'">Back</button>
        <span>Werewolf</span>
        <button style="margin-bottom: 10px; margin-left: 10px" @click="localMenu='role-solo'">Next</button>
        
        <div class='container' v-for="(role,i) in rolesList.Werewolf" :key="i">
          <!-- Village roles  -->
          <div class='role-card'  :class="[role.avialblity ? 'trueAva': 'falseAva']" @click="role.avialblity = !role.avialblity" >
            <img :src="role.imgLink"  style="width: 75px; margin-top:5px" v-if="role.name !=='Priest' && role.name !== 'Medium' && role.name !== 'Bodyguard' &&  role.name !== 'Grumpy Grandma'  ">
            <img :src="role.imgLink"  style="width: 60px; margin-top:5px" v-else>
            <span>{{role.name}}</span>
          </div>
        </div>
      </div>

      <div class='roleselection' v-if="localMenu === 'role-solo'">
        <button style="margin-bottom: 10px;margin-right: 10px" @click="localMenu='role-wolves'">Back</button>
        <span>Solo</span>
        <button style="margin-bottom: 10px; margin-left: 10px" @click="goWithThese() ">Ready</button>
        
        
        
        <div  class='container' v-for="(role,i) in rolesList.Solo" :key="i">
          <!-- Village roles  -->
          <div class='role-card'  :class="[role.avialblity ? 'trueAva': 'falseAva']" @click="role.avialblity = !role.avialblity" >
            <img :src="role.imgLink"  style="width: 75px; margin-top:5px" v-if="role.name !=='Serial Killer' ">
            <img :src="role.imgLink"  style="width: 60px; margin-top:5px" v-else>
            <span>{{role.name}}</span>
          </div>
        </div>
      </div>
    
    </div>

    <div v-if="localMenu === 'practice'">
      <p>Player1: {{player1}}</p>
      <p>Player2: {{player2}}</p>
      <p>Player3: {{player3}}</p>
      <p>Player4: {{player4}}</p>
      <p>Player5: {{player5}}</p>
      <p>Player6: {{player6}}</p>
      <p>Player7: {{player7}}</p>

      <button @click="practice()">OK?</button>

    </div>


    <div v-if="localMenu === 'predemo' && !isPlaying" >

      <div class='roleselection' >
        <div class='container' v-for="(player,i) in gameData.players" :key="i">
            <!-- Village roles  -->
            <div class="player-card"  :class="[(player.isAlive ? '': 'dead'),(player.team === 'Village'? 'border-black': ''),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Solo'? 'border-green': ''),(selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': '')] " @click="clickThePlayer(i)">

              <img :src="player.imgLink" style="width: 60px; margin-top:5px" v-if="(timeCondition === 'Night' || isAnnouncing) || (player.teamm === 'Werewolf' && aliveWerewolfNum === 1 && timeCondition === 'Night')">


              <!-- chansge into voting style if there are multiple  -->
              <span style="width: 60px; margin-top:5px; font-size: 300%" v-if="timeCondition === 'Night' && !isAnnouncing && currentPlayer.team === 'Werewolf' && aliveWerewolfNum >1   ">
                {{PreyCandidatesList[i].voteCount}}
              </span>

              <span style="width: 60px; margin-top:5px; font-size: 300%" v-if="timeCondition === 'Day' && !isAnnouncing">
                {{votedList[i].voteCount}}
              </span>

              <span class='player-name'>{{player.name}}:</span>
              <span class='player-roll'>{{player.roll}}</span>
            </div>
        </div>
        
      </div>

      <div >

        <div v-if="!readyToPlay && winnerTeam === ''" style="clear:both ">
          
          <button @click="assignRoles">Assign roooles</button>
          
          <br><br>
          <button  @click="startGame()">Ready</button>
        </div>
        <div v-if="winnerTeam !== ''">
        </div>

        <div v-else style="clear:both;">
          
          <!-- <p>It is {{timeCondition}} time of day {{gameData.days.length}}</p> -->
          <!-- <p>{{isAnnouncing}}</p> -->
          <hr>

          <div v-if="!isAnnouncing && readyToPlay">
            <p v-if="timeCondition === 'Night'">{{currentPlayer.name}}'s turn. Roll: {{currentPlayer.roll}}</p>

            <div v-if="timeCondition === 'Day'">
              <p v-if="selectingPlayer"> {{currentPlayer.name}}'s turn to vote.</p>
              <p v-if="selectingPlayer">Vote for Somebody by tapping the player</p>
              <p v-if="selectingPlayer">or</p>
              <p v-if="!selectingPlayer">{{currentPlayer.name}}'s voting for {{this.gameData.players[currentPlayer.votingFor].name}} </p>
              <button  @click="skipVote">Skip Votings</button>
              
              
            </div>

            
          
            <p v-if="selectingPlayer && timeCondition === 'Night'">Choose Your target</p>
            <p v-if="!selectingPlayer && currentPlayer.killTarget !== '' && timeCondition === 'Night'">Your target is {{this.gameData.players[currentPlayer.killTarget].name}}</p>
            
            <!-- <p>{{gameData.players.lengtn}}</p> -->
            <br>
            <button @click="nextTurn()" v-if="timeCondition === 'Night' && readyToFinishTurn">Confirm</button>
            <button style="margin-left: 10px" @click="selectOne()" v-if="currentPlayer.roll === 'Werewolf' && timeCondition === 'Night' && currentPlayer.killTarget !== '' ">Change yourt target</button>

            <button @click="nextTurn()" v-if="timeCondition === 'Day' && !isAnnouncing && readyToFinishVote">Confirm</button>
            
            <button style="margin-left: 5px" @click="selectingPlayer = true" v-if="!selectingPlayer&& timeCondition === 'Day'">Change yourt votes</button>

          </div>

          
        

        <div v-if="isAnnouncing">
          <!-- <p>{{attackTargetedList}}</p> -->
          <div v-for="(list,i) in attackTargetedList" :key="i">
            <p>{{gameData.players[list.targetIndex].name}} was killed </p>
            <p>{{gameData.players[list.targetIndex].name}} was {{gameData.players[list.targetIndex].roll}}</p>

          </div>
          
          <button @click="isAnnouncing= flase; selectingPlayer = true" v-if="timeCondition === 'Day' && isAnnouncing">Move to day time</button>

          <!-- <p>{{voted}}</p> -->

          <p v-if="timeCondition === 'Night' && isAnnouncing && voted">{{announcingMessage}}</p>
          <button @click="isAnnouncing= flase" v-if="timeCondition === 'Night' && isAnnouncing && voted">Move to night time</button>
        </div>

        
        <!-- <p>{{attackTargetedList}}</p> -->
        </div>
        
        <!-- <div v-if="winnerTeam !== ''" style="clear:both;">
          <p>{{winnerTeam}} won!</p>
        </div> -->
      </div>


    </div>




    <div v-if="isPlaying">
      <small>It is {{timeCondition}} time of day {{this.gameData.days.length}}</small>

      <div v-if="timeCondition === 'Night' && !isAnnouncing">

        <div class='roleselection'>
          <div class='container display-section' v-for="(player,i) in gameData.players" :key="i">

            <!-- Villager roles  -->
            <div v-if="currentPlayer.roll === 'Villager'">
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Village'? 'border-black': ''),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Solo'? 'border-green': '')] ">

                <img :src="player.imgLink" style="width: 60px; margin-top:5px" >

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>

            <!-- seer and aura seer  -->
            <div v-if="currentPlayer.roll === 'Seer' || currentPlayer.roll === 'Aura Seer'" >
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': ''] " @click="clickSeer(i)">

                <img :src="player.imgLink" style="width: 60px; margin-top:5px">

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>

            <!-- avenger  -->
            <div v-if="currentPlayer.roll === 'Avenger'" >
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': ''] " @click="clickAvenge(i)">

                <img :src="player.imgLink" style="width: 60px; margin-top:5px">

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>

            <!-- Doctor  -->
            <div v-if="currentPlayer.roll === 'Doctor'" >
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': ''] " @click="clickDoctor(i)">

                <img :src="player.imgLink" style="width: 60px; margin-top:5px">

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>

            <!-- Medium  -->
            <div v-if="currentPlayer.roll === 'Medium'" >
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': ''] " @click="clickMediium(i)">

                <img :src="player.imgLink" style="width: 60px; margin-top:5px">

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>

            <!-- Fool -->
            <div v-if="currentPlayer.roll === 'Fool'" >
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': ''] " >

                <img :src="player.imgLink" style="width: 60px; margin-top:5px">

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>




            <!-- solo wolf  -->
            <div v-if="currentPlayer.roll === 'Werewolf' && aliveWerewolfNum === 1">
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': ''] " @click="clickPrey(i)">

                <img :src="player.imgLink" style="width: 60px; margin-top:5px" >

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>

            <!-- multiple wolf  -->
            <div v-if="currentPlayer.roll === 'Werewolf' && aliveWerewolfNum > 1">
              <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),selectingPlayer && player.name !== currentPlayer.team ? 'selectingPlayer': ''] " @click="clickPrey(i)">

                <img v-if="player.team === 'Werewolf' || !player.isAlive" :src="player.imgLink" style="width: 60px; margin-top:5px">
                <span v-if="player.team !== 'Werewolf' && player.isAlive" style="width: 60px; margin-top:5px; font-size: 300%" >
                  {{PreyCandidatesList[i].voteCount}}
                </span>
                <!-- <img v-if="!player.isAlive" :src="player.imgLink" style="width: 60px; margin-top:5px" > -->

                <span class='player-name'>{{player.name}}:</span>
                <span class='player-roll'>{{player.roll}}</span>
              </div>
            </div>
            
          </div>


          <div style="clear:both;" class='action-section'>

            <!-- Villager roles  -->
            <div v-if="currentPlayer.roll === 'Villager'">
              <div style="clear:both;">
                <p>{{currentPlayer.name}}'s {{currentPlayer.roll}}</p>

                <p>Trivia is going to be here</p>
                <!-- <button @click="nextTurn()" v-if="readyToFinishTurn">Confirm</button> -->
                <button @click="nextTurn()" v-if="readyToFinishTurn">Finish your turn </button>
              </div>

            </div>

            <!-- seer, aura seer   -->
            <div v-if="currentPlayer.roll === 'Seer' || currentPlayer.roll === 'Aura Seer'">
              <div style="clear:both;">
                <!-- <p>{{selectingPlayer}}</p> -->
                <p>{{currentPlayer.name}} is {{currentPlayer.roll}}</p> 
                <p v-if="readyToFinishTurn" style="color:red">{{discovery}}</p>
                
                 <!-- change, choose someone, finish button  -->
                <button @click="selectingPlayer = true" v-if="!readyToFinishTurn">Choose your target</button>

                <div v-if="readyToFinishTurn">
                  <button @click="nextTurn(), discovery = ''" >Finish your turn </button>
                </div>
              </div> 
            </div>

            <!-- Aveneg  -->
            <div v-if="currentPlayer.roll === 'Avenger'">
              <div style="clear:both;">
                <!-- <p>{{selectingPlayer}}</p> -->
                <p>{{currentPlayer.name}} is {{currentPlayer.roll}}</p> 
                <p v-if="readyToFinishTurn" style="color:red">Your target is {{gameData.players[ currentPlayer.dieWith].name}}</p>
                
                <!-- change, choose someone, finish button  -->
                <button @click="selectingPlayer = true" v-if="!readyToFinishTurn">Choose your target</button>
                <!-- <p>{{gameData.players[currentIndex]}}</p> -->

                <div v-if="readyToFinishTurn">
                  <button @click="nextTurn()" >Finish your turn </button>
                  or
                  <button @click="selectingPlayer = true" v-if="readyToFinishTurn">Change your target</button>
                </div>
              </div> 
            </div>

            <!-- Doctor  -->
            <div v-if="currentPlayer.roll === 'Doctor'">
              <div style="clear:both;">
                <!-- <p>{{selectingPlayer}}</p> -->
                <p>{{currentPlayer.name}} is {{currentPlayer.roll}}</p> 
                <p v-if="readyToFinishTurn" style="color:red">You are protecting {{gameData.players[ currentPlayer.protecting].name}}</p>
                
                <!-- change, choose someone, finish button  -->
                <button @click="selectingPlayer = true" v-if="!readyToFinishTurn">Choose who you'd like to protecte</button>
                <!-- <p>{{gameData.players[currentIndex]}}</p> -->

                <div v-if="readyToFinishTurn">
                  <button @click="nextTurn()" >Finish your turn </button>
                  or
                  <button @click="selectingPlayer = true" v-if="readyToFinishTurn">Change who you are protecting</button>
                </div>
              </div> 
            </div>

            <!-- Medium  -->
            <div v-if="currentPlayer.roll === 'Medium'">
              <div style="clear:both;">
                <!-- <p>{{selectingPlayer}}</p> -->
                <p>{{currentPlayer.name}} is {{currentPlayer.roll}}</p> 
                <p v-if="instantMediumMessage !== ''">{{instantMediumMessage}}</p>
                <p v-if="currentPlayer.amountOfAbility === 0" style="color:red">You alredy used your ability</p>
                <!-- <p> {{currentPlayer.amountOfAbility}}</p> -->
                <!-- <p>hey</p> -->
                
                <!-- change, choose someone, finish button  -->
                <button @click="selectingPlayer = true" v-if="currentPlayer.amountOfAbility !== 0 && hasAnyVillagTeamDied">Choose who you'd like to revive (Only once a game)</button>

                <p v-if="!hasAnyVillagTeamDied">No one from village has died yet</p>
                <!-- <p>{{gameData.players[currentIndex]}}</p> -->
                <br><br>
                <div v-if="readyToFinishTurn">
                  <button @click="nextTurn(), instantMediumMessage =''" >Finish your turn </button>
                </div>
              </div> 
            </div>


            <!-- Fool  -->
            <div v-if="currentPlayer.roll === 'Fool'">
              <div style="clear:both;">
                <div v-if="readyToFinishTurn">
                  <p>{{currentPlayer.name}}'s {{currentPlayer.roll}}</p>
                  <button @click="nextTurn()" >Finish your turn </button>
                </div>
              </div> 
            </div>



            <!-- solo wolf  -->
            <div v-if="currentPlayer.roll === 'Werewolf' && aliveWerewolfNum === 1">
              <div style="clear:both;">
                <p>{{currentPlayer.name}} is {{currentPlayer.roll}}</p> 
                <p v-if="readyToFinishTurn">Your taret is: [ {{gameData.players[currentPlayer.killTarget].name}} ]</p>

                
                 <!-- change, choose someone, finish button  -->
                 <button @click="selectingPlayer = true" v-if="!readyToFinishTurn">Choose your target</button>

                <div v-if="readyToFinishTurn">
                  <button @click="nextTurn()" >Finish your turn </button>
                  <small style="margin-left:10px; margin-right:10px;">or</small> 
                  <button @click="selectingPlayer = true">Change your target</button>
        
                </div>
                
              </div> 

            </div>

            <!-- multiple wolf  -->
            <div v-if="currentPlayer.roll === 'Werewolf' && aliveWerewolfNum > 1">
              <div style="clear:both;">
                <p>{{currentPlayer.name}} is {{currentPlayer.roll}}</p> 
                <p v-if="readyToFinishTurn" style="margin-top:-10px">Your taret is: [ {{gameData.players[currentPlayer.killTarget].name}} ]</p>

                <p>-------- Your werewolf teammate -----------</p>
                <!-- <p>{{aliveWerewolfNum}}</p> -->
                <div v-for="(aliveWolf,i) in IndexOfAliveWerewolf" :key="i">
                  <div v-if="currentIndex !== aliveWolf">
                    <p style="color:red">{{gameData.players[aliveWolf].name}}, as {{gameData.players[aliveWolf].roll}}.</p>
                    <p v-if="gameData.players[aliveWolf].killTarget === ''">Current Target: Not selected yet</p>
                    <p style="margin-top:-10px" v-else>Current Target: {{gameData.players[gameData.players[aliveWolf].killTarget].name}}</p>

                  </div>

                </div>
                 <p style="margin-top:-10px">-----------------------------------------</p>


                 <!-- change, choose someone, finish button  -->
                 <button @click="selectingPlayer = true" v-if="!readyToFinishTurn">Choose your target</button>

                <div v-if="readyToFinishTurn">
                  <button @click="nextTurn()" >Finish your turn </button>
                  <small style="margin-left:10px; margin-right:10px;">or</small> 
                  <button @click="selectingPlayer = true">Change your target</button>
        
                </div>
                
              </div> 

            </div>


          </div>


        </div>
      </div>



      <div v-if="timeCondition === 'Day' && !isAnnouncing">
        


        <div class='container display-section' v-for="(player,i) in gameData.players" :key="i">
            <div class="player-card"   :class="[(player.isAlive ? '': 'dead'),(player.team === 'Werewolf'? 'border-red': ''),(player.team === 'Village'? 'border-black': ''),(player.team === 'Solo'? 'border-green': ''),player.name !== currentPlayer.team ? 'selectingPlayer': ''] " @click="clickVote(i)">

              <span style="width: 60px; margin-top:5px; font-size: 300%" v-if="timeCondition === 'Day' && !isAnnouncing && player.isAlive">
              <img v-if="!player.isAlive" :src="player.imgLink" style="width: 60px; margin-top:5px" >
              
              {{votedList[i].voteCount}}
              </span>
              <img v-if="!player.isAlive" :src="player.imgLink" style="width: 60px; margin-top:5px" >

              <span class='player-name'>{{player.name}}:</span>
              <span class='player-roll'>{{player.roll}}</span>
            </div>
          
        </div>


        <div style="clear:both;" class='action-section'>
          <div style="clear:both;">
            <p v-if="currentPlayer.votingFor !== ''">{{currentPlayer.name}}'s voting for {{gameData.players[currentPlayer.votingFor].name}}</p>
            

            <div v-if="currentPlayer.votingFor === ''">
              <p>{{currentPlayer.name}}'s turn</p>
              <p>Vote for somebody by clikcking the player</p>

            </div>
            


            <div v-if="currentPlayer.votingFor !== ''">
              <button @click="nextTurn()" >Finish your turn </button>
              <small style="margin-left:10px; margin-right:10px;">or, change your vote</small> 
            </div>

            <button  @click="skipVote" style="margin-top:10px">Skip Votings</button>

          </div>


        </div>

      </div>


      <div v-if="isAnnouncing">

        <div v-if="isAnnouncing && timeCondition === 'Day'">
          <!-- <p>{{attackTargetedList}}</p> -->
          <div v-if="killSuccess">
            <div v-for="(list,i) in attackTargetedList" :key="i" >
              <p  style="color:red">{{gameData.players[list.targetIndex].name}} was killed.</p>
              <p  style="color:red">{{gameData.players[list.targetIndex].name}} was {{gameData.players[list.targetIndex].roll}}.</p>

              <br>

              <div v-if="avengeLog !== ''">
                <p style="color:red">{{avengeLog}}</p>
              </div>

            </div>
          </div>

          <div v-if="!killSuccess">
            <p><strong>No one died last night</strong> </p>
            <p style="color:red">{{docLog}}</p>
          
          </div>


          <!-- in case medium revive someone -->
          <div v-for="(log,i) in reviveLog" :key="i" >
            <p style="color:red"> {{log}} </p>
          </div>
          
          


          <button @click="isAnnouncing= flase; selectingPlayer = true, avengeLog = '', killSuccess = true, reviveLog = []" v-if="timeCondition === 'Day' && isAnnouncing && winnerTeam === ''">Move to day time</button>
        </div>



        <div v-if="isAnnouncing && timeCondition === 'Night'">
          <p v-if="timeCondition === 'Night' && isAnnouncing && voted" style="color:red">{{announcingMessage}}</p>

          <div v-if="avengeLog !== ''">
              <p style="color:red">{{avengeLog}}</p>
            </div>

          <button @click="isAnnouncing= flase, avengeLog = ''" v-if="timeCondition === 'Night' && isAnnouncing && voted && winnerTeam === ''">Move to night time</button>
        </div>

      </div>





      <!-- if the team wins -->
      <div v-if="winnerTeam !== ''" style="clear:both; margin-top: 40px; color:red">
          <p>{{winnerTeam}} won!</p>
      
      </div>
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
      // currentMenu: 'local',
      localMenu: 'rule',
      // localMenu: 'predemo',
      username: '',
      
      rolesList,
      gameData: {
        players: [],
        days: [],
      

      },

      readyToPlay: false,
      selectingPlayer: false,
      isAnnouncing: false,
      announcingMessage: '',
      winnerTeam: '',
      isPlaying: false,
      discovery: '',
      avengeLog: '',
      docLog: '',
      reviveLog: [],
      reservationForMedium: [],
      instantMediumMessage: '',

      limitSolo: 1,
      killSuccess: true,


      

      player1: 'Nozo',
      player2: 'Becca',
      player3: 'Mom',
      player4: 'Dad',
      player5: 'Danieele',
      player6: 'David',
      player7: 'Johnathan',

      numOfPlayer: 7,
    }
  },

  computed:{
    availableList(){
      let list =  {
        characters: {Village: [], Werewolf:[], Solo:[]},
        counters: {Village: null, Werewolf:null, Solo:null},
      }
      // console.log(list)


      let i = 0
      let counting = 0
      while(i < this.rolesList.Village.length){
        if(this.rolesList.Village[i].avialblity){
          counting++
          list.characters.Village.push({name: rolesList.Village[i].name, imgLink: rolesList.Village[i].imgLink, team: 'Village'});
        }
        i++
      }
      list.counters.Village = counting

      i = 0
      counting = 0
      while(i < this.rolesList.Werewolf.length){
        if(this.rolesList.Werewolf[i].avialblity){
          counting++
          list.characters.Werewolf.push({name: rolesList.Werewolf[i].name, imgLink: rolesList.Werewolf[i].imgLink, team:'Werewolf' });
        }
        i++
      }
      list.counters.Werewolf = counting

      i = 0
      counting = 0
      while(i < this.rolesList.Solo.length){
        if(this.rolesList.Solo[i].avialblity){
          counting++
          list.characters.Solo.push({name: rolesList.Solo[i].name, imgLink: rolesList.Solo[i].imgLink, team: 'Solo' });
        }
        i++
      }
      list.counters.Solo = counting


      
      return list
    },
    currentPlayer(){
      if(this.readyToPlay){
        let Index = this.gameData.days[this.gameData.days.length-1].currentPlayersIndex
        return this.gameData.players[Index]

      }else{

        return this.gameData.players[0]
      }
        
    },
    currentIndex(){
      return this.gameData.days[this.gameData.days.length-1].currentPlayersIndex
    },
    timeCondition(){
      if(this.gameData.days.length === 0){
        return 'Night'
      }
      else{
        let Index = this.gameData.days.length-1
        if(this.gameData.days[Index].isNightOver){
          return 'Day'
        }else{
          return 'Night'
        }

      }
      
      
      // return 'hey'/
    },
    voted(){
      let list= this.gameData.days[this.gameData.days.length-2]
      if(this.timeCondition === 'Night'){
        if(list.voteFinished){
          return true
        }else{
          return false
        }
      }else{
        list= this.gameData.days[this.gameData.days.length-1]
        if(list.voteFinished){
          return true
        }else{
          return false
        }
      }
      


    },
    survivors(){
      let list = this.gameData.players
      // let survivors = 
      let updatedList = []
      let i =0;
      while(i < list.length){
        if(list[i].isAlive){
          updatedList.push({name: '', originalIndex: i})
          // rolesList.Werewolf.push({name: '',  img Link: ''});
        }

        i++
      }

      return updatedList
    },
    PercentageOfWerewolf(){
      let total = this.survivors.length 
      let count = 0;
      let WerewolfCount = 0
      while(count < total){
        let theIndex = this.survivors[count].originalIndex
        if(this.gameData.players[theIndex].team === 'Werewolf'){
          WerewolfCount++
        }
        
        count++
      }
      return Math.floor((WerewolfCount/total) * 100)
      // return 100
    },


    docsProtectingList(){
      let count = 0
      let listList = []
      while(count < this.gameData.players.length){
        if(this.gameData.players[count].isAlive){
          if(this.gameData.players[count].protecting !== ''){
            listList.push(this.gameData.players[count].protecting)
          } 
        }
        count++
      }
      return listList
    },
    attackTargetedList(){
      let list = this.gameData.players
      let updatedList = []
      let i =0;
      while(i < list.length){
        if(list[i].killTarget !== ''){
          // so it will only have one data 
          updatedList = []
          updatedList.push({targetIndex: list[i].killTarget, actorIndex: i})
        }

        i++
      }

      return updatedList
    },
    votedList(){
      let OGList = this.gameData.players
      let voteList = []
      let i =0;
      
      // make a base list
      while(i < OGList.length){
        voteList.push({originalIndex: i,  voteCount: 0})
        i++
      }

      i = 0

      while(i < OGList.length){
        let theIndex =  OGList[i].votingFor 
        if(theIndex !== ''){
          voteList[theIndex].voteCount++
        }
        
        
        i++
      }

      return voteList
    },
    PreyCandidatesList(){
      let OGList = this.gameData.players
      let canditateList = []
      let i =0;
      
      // make a base list
      while(i < OGList.length){
        canditateList.push({originalIndex: i,  voteCount: 0})
        i++
      }

      i = 0

      while(i < OGList.length){
        let theIndex =  OGList[i].killTarget
        if(theIndex !== ''){
          canditateList[theIndex].voteCount++
        }
        
        
        i++
      }

      return canditateList

    },


    readyToFinishTurn(){
      let readyFlag = true;
      switch(this.currentPlayer.roll){
        case 'Werewolf':
          if(this.currentPlayer.killTarget === ''){
            readyFlag = false
          }
          break
        
        case 'Seer':
          if(this.discovery === ''){
            readyFlag = false
          }
          break

        case 'Aura Seer':
          if(this.discovery === ''){
            readyFlag = false
          }
          break

        case 'Avenger':
          // if(this.currentPlayer.roll !== 'Avenger'){
          //   readyFlag = false
          //   break
          // }
          if(this.currentPlayer.dieWith === ''){
            readyFlag  =false
            break
          }
          
          if(!this.gameData.players[this.currentPlayer.dieWith].isAlive){
            readyFlag = false
          }
          break
        
        case 'Doctor':
          // if(this.currentPlayer.roll !== 'Avenger'){
          //   readyFlag = false
          //   break
          // }
          if(this.currentPlayer.protecting === ''){
            readyFlag  =false
            break
          }
          
          if(!this.gameData.players[this.currentPlayer.protecting].isAlive){
            readyFlag = false
          }
          break
        
        
        // doctor or village just can finish without doing anything
      }
      return readyFlag 
    },

    readyToFinishVote(){
      let readyFlag = true;
      // switch(this.currentPlayer.roll){
      //   case 'Werewolf':
      //     if(this.currentPlayer.killTarget === ''){
      //       return readyFlag = false
      //     }
        
      //   // case 'Village':
      //   //   return true
      // }
      if(this.currentPlayer.votingFor === ''){
        readyFlag = false
      }
      return readyFlag 
    },

    adequentWerewolf(){
      let theList = this.gameData.players
      let Max = theList.length * 0.35
      let i = 0;
      let WerewolfCount = 0

      while(i < theList.length){
        if(theList[i].team === 'Werewolf'){
          WerewolfCount++
          // console.log(WerewolfCount)
        }
        i++
      }

      // Talking about the future, so plus one
      if(WerewolfCount + 1 <= Max){
        return false
      }else{
        return true
      }

    },
    adequentSolo(){
      let theList = this.gameData.players
      let Max = theList.length * 0.35
      let i = 0;
      let SoloCount = 0

      while(i < theList.length){
        if(theList[i].team === 'Solo'){
          SoloCount++
          // console.log(WerewolfCount)
        }
        i++
      }

      // Talking about the future, so plus one
      if(SoloCount + 1 <= Max){
        return false
      }else{
        return true
      }

    },
    aliveWerewolfNum(){
      let theList = this.gameData.players
      // let Max = theList.length * 0.35
      let i = 0;
      let WerewolfCount = 0

      while(i < theList.length){
        if(theList[i].team === 'Werewolf' && theList[i].isAlive){
          WerewolfCount++
          // console.log(WerewolfCount)
        }
        i++
      }
      return WerewolfCount
    },
    IndexOfAliveWerewolf(){
      let theList = this.gameData.players
      // let Max = theList.length * 0.35
      let i = 0;
      // let WerewolfCount = 0
      let indexList = []

      while(i < theList.length){
        if(theList[i].team === 'Werewolf' && theList[i].isAlive){
          indexList.push(i)
          // console.log(WerewolfCount)
        }
        i++
      }
      return indexList

    },

    hasAnyVillagTeamDied(){
      let flagFlag= false
      let count =0
      let listList = this.gameData.players

      while(count < listList.length){
        if(listList[count].team === 'Village' && !listList[count].isAlive){
          flagFlag = true
        }
        count++
      }

      return flagFlag

    },

    SoloNum(){
      let theList = this.gameData.players
      let i = 0;
      let count = 0

      while(i < theList.length){
        if(theList[i].team === 'Solo'){
          count++
          // console.log(WerewolfCount)
        }
        i++
      }
      return count
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
      this.localMenu = 'practice'
      // this.localMenu = 'role-Village'
      this.username = 'hectoer'
      this.numOfPlayer = 7
    },
    oniSkip(){
      // console.log('ehuh')
      this.currentMenu= 'local'
      this.username = 'hectoer'
      this.practice();
      this.localMenu = 'predemo'

      this.assignRoles()
      // console.log('howbaboutiub')
      console.log(this.currentMenu)


    },

    practice(){
      // this.localMenu = 'predemo'
      this.localMenu = 'role-Village'
      
      this.gameData.players.push({name: this.player1, role: '',isAlive: true,team: '', dieWith: '', protecting: ''});
      this.gameData.players.push({name: this.player2, role: '',isAlive: true,team: '', dieWith: '',protecting: ''});
      this.gameData.players.push({name: this.player3, role: '',isAlive: true,team: '', dieWith: '',protecting: ''});
      this.gameData.players.push({name: this.player4, role: '',isAlive: true,team: '', dieWith: '',protecting: ''});
      this.gameData.players.push({name: this.player5, role: '',isAlive: true,team: '', dieWith: '',protecting: ''});
      this.gameData.players.push({name: this.player6, role: '',isAlive: true,team: '', dieWith: '',protecting: ''});
      this.gameData.players.push({name: this.player7, role: '',isAlive: true,team: '', dieWith: '',protecting: ''});

      // console.log(this.gameData)


    },

    assignFirst(){
      let i = 0
      while(i < this.gameData.players.length){
        this.gameData.players[i].roll = ''
        i++
      }

      let lists = this.gameData.players

      // Wolf and Villager can be any one of ones from the team

      let IndexWolf = Math.floor(Math.random() * lists.length) 
      let IndexVillage = Math.floor(Math.random() * lists.length)
      while(IndexVillage === IndexWolf ){
        IndexVillage = Math.floor(Math.random() * lists.length)
      }

      // let WerewolvesLists = this.availableList.characters.Werewolf Math.floor(Math.random() * lists.length) 
      
      // get random wolf charcters that is avaible right now
      
      let randomIndexWolf = this.getRandomIndex('Werewolf')
      let randomWerewolf = this.availableList.characters.Werewolf[randomIndexWolf]

      this.gameData.players[IndexWolf].roll = randomWerewolf.name
      this.gameData.players[IndexWolf].team = randomWerewolf.team
      this.gameData.players[IndexWolf].imgLink = randomWerewolf.imgLink
      this.gameData.players[IndexWolf].amountOfAbility= 1
      
      this.gameData.players[IndexWolf].killTarget = '' 
      this.gameData.players[IndexWolf].votingFor = '' 



      let randomIndexVillage = this.getRandomIndex('Village')
      let randomVillager = this.availableList.characters.Village[randomIndexVillage]

      this.gameData.players[IndexVillage].roll = randomVillager.name
      this.gameData.players[IndexVillage].team = randomVillager.team
      this.gameData.players[IndexVillage].imgLink = randomVillager.imgLink
      this.gameData.players[IndexVillage].killTarget = ''
      this.gameData.players[IndexVillage].votingFor = '' 
      this.gameData.players[IndexVillage].amountOfAbility= 1

    },
    assignRoles(){

      // call function that will take care of the clear the data, and add one werewolf and one Villager(Villager can be other Villager not only just plain villater, same as werewolf(each one of them are eable to kill them so.))
      // console.log()/
      this.assignFirst()
      

      let i = 0
      // console.log(`Players length: ${this.gameData.players.length}`)
      // console.log(`Max of the wolf is: ${Math.floor(this.gameData.players.length * 0.35)}`)
      while(i < this.gameData.players.length){
        
        let randomCharcter = null
        let randomIndex = null
        if(this.gameData.players[i].roll === '' ){
          let randomRandom = Math.floor(Math.random() * 101); 


          // decide if they can have more werewolf
          // if so, the next charcter will be a werewolf with the chance of 35%
          if(randomRandom >= 80 && !this.adequentWerewolf){
            randomIndex = this.getRandomIndex('Werewolf')
            randomCharcter = this.availableList.characters.Werewolf[randomIndex]

          }else if(randomRandom >= 65 && randomRandom <= 80 && !this.adequentSolo){
            randomIndex = this.getRandomIndex('Solo')
            randomCharcter = this.availableList.characters.Solo[randomIndex]

          }else{
            randomIndex = this.getRandomIndex('Village')
            randomCharcter = this.availableList.characters.Village[randomIndex]
          }


          // if(!this.adequentWerewolf){
          //   if(randomRandom >= 80){
          //     // randomTeam = 'Werewolf'
          //     randomIndex = this.getRandomIndex('Werewolf')
          //     randomCharcter = this.availableList.characters.Werewolf[randomIndex]
          //   }else{
          //     if(this.limitSolo !== 0){

          //     }else{
          //       randomIndex = this.getRandomIndex('Village')
          //       randomCharcter = this.availableList.characters.Village[randomIndex]
          //     }

              
              
          //   }
          // }else{
          //   randomIndex = this.getRandomIndex('Village')
          //   randomCharcter = this.availableList.characters.Village[randomIndex]
          // }
          // console.log(`${i}: ${randomCharcter.name}`)



          // let randomIndex = this.getRandomIndex(randomTeam)
          // let randomCharcter = this.availableList.characters.Village[randomIndex]

          this.gameData.players[i].roll = randomCharcter.name
          this.gameData.players[i].team = randomCharcter.team
          this.gameData.players[i].imgLink = randomCharcter.imgLink
          this.gameData.players[i].amountOfAbility = 1
          this.gameData.players[i].killTarget = ''
          this.gameData.players[i].votingFor = '' 
        }  
        // console.log(this.gameData.players[i].team)
        i++
      }
      // console.log(this.gameData)




    },
    goWithThese(){
      this.localMenu='predemo'
      // this.localMenu = 'Playing'
      this.isPlaying = true
    },



    getRandomIndex(team){
      // console.log(team)
      let list = null;
      switch(team){
        case 'Village':
          list = this.availableList.characters.Village
          return Math.floor(Math.random() * list.length) 
        
        case 'Werewolf':
          list = this.availableList.characters.Werewolf
          return Math.floor(Math.random() * list.length) 
        

        case 'Solo':
          list = this.availableList.characters.Solo
          return Math.floor(Math.random() * list.length) 
        
      }
    },
    startGame(){
      this.isPlaying = true
      this.readyToPlay = true
      this.gameData.days.push({Nightactions: [],voteFinished: false, currentPlayersIndex: 0, isNightOver: false, isDayOver: false});

      // if(this.currentPlayer.roll === 'Werewolf'){
      //   this.selectingPlayer = true
      // }
      

    },
    nextTurn(){
      this.discovery = ''
      this.selectingPlayer

      let Index = this.gameData.days.length-1
      // if( this.timeCondition === 'Night'){ 
      if( !this.gameData.days[Index].isNightOver){
        
        // let theNum = this.gameData.days[Index].currentPlayersIndex
        if(this.gameData.days[Index].currentPlayersIndex +1 >= this.gameData.players.length ){
          // console.log('over')
          this.isAnnouncing  = true; 
          this.gameData.days[Index].isNightOver = true;
          this.gameData.days[Index].currentPlayersIndex =0
          this.executeNightActions()
          

        }else{
          this.gameData.days[Index].currentPlayersIndex++
          // if(this.gameData.players[this.currentIndex].team === 'Werewolf'){
          //   // this.selectingPlayer = true
          // }

           
        }
        while(!this.gameData.players[this.currentIndex].isAlive){
          if(this.gameData.days[Index].currentPlayersIndex +1 >= this.gameData.players.length ){
            console.log('over')
            this.isAnnouncing  = true; 
            this.gameData.days[Index].isNightOver = true;
            this.gameData.days[Index].currentPlayersIndex =0
            this.executeNightActions()
          }else{
            this.gameData.days[Index].currentPlayersIndex++
            // if(this.gameData.players[this.currentIndex].team === 'Werewolf'){
            //   this.selectingPlayer = true
            // }
          }
        }
      }
      else if(this.gameData.days[Index].isNightOver){
        if(this.gameData.days[Index].currentPlayersIndex +1 >= this.gameData.players.length ){
          // console.log('obver')
          this.gameData.days[Index].isDayOver= true;
          this.gameData.days.push({Nightactions: [], currentPlayersIndex: 0,voteFinished: false, isNightOver: false, isDayOver: false});
          this.executeDayActions()

          this.selectingPlayer = false
          this.isAnnouncing = true;
          this.gameData.days[Index].voteFinished = true;
          // if(this.currentPlayer.roll === 'Werewolf'){
          //   this.selectingPlayer = true
          // }

        }else{
          this.selectingPlayer = true
          this.gameData.days[Index].currentPlayersIndex++
        }

        while(!this.gameData.players[this.currentIndex].isAlive){
          Index = this.gameData.days.length-1
          if(this.gameData.days[Index].currentPlayersIndex +1 >= this.gameData.players.length ){
            console.log('over')
            this.isAnnouncing  = true; 
            this.gameData.days[Index].isDayOver = true;
            this.gameData.days[Index].voteFinished = true;

            this.gameData.days.push({Nightactions: [], currentPlayersIndex: 0, isNightOver: false, isDayOver: false});
            this.isAnnouncing = true;

            // this.gameData.days[Index].currentPlayersIndex =0
            // this.selectingPlayer = false
            this.executeDayActions()
          }else{
            this.gameData.days[Index].currentPlayersIndex++
            Index = this.gameData.days.length-1
            this.selectingPlayer = true
          }
          
        }


      }
    },
    skipVote(){
      let r= confirm(`Would you like to skip voting?`);
      if(!r){
        return;
      }
      this.gameData.players[this.currentIndex].votingFor = ''
      this.nextTurn()
    },

    executeNightActions(){

      // kill and protect
      // check if we have to continue the game or not
      // clear the target after that

      
      let ultimateIndex = null
      let randomCanditaList = []

      if(this.aliveWerewolfNum === 1){
        // when there is only one werewolf left

        // who is werewolf
        let list = this.gameData.players
        let listCount = 0
        let lonleyWolf = null
        while(listCount < list.length){
          if(this.gameData.players[listCount].team === 'Werewolf'){
            if(this.gameData.players[listCount].isAlive){
              lonleyWolf = this.gameData.players[listCount]
            }
          }
          listCount++
        }
        console.log('Just by yourself')
        console.log('------')

        ultimateIndex = lonleyWolf.killTarget
      }else{
        // in case of multiples wolves

        let count = 0
        let comparison = 0
        let legit = true;
        let HighIndex  = '';


        while(count < this.PreyCandidatesList.length){
          if(this.PreyCandidatesList[count].voteCount > comparison){ 
            HighIndex = count
            comparison =this.PreyCandidatesList[count].voteCount
            legit = true
            randomCanditaList = []
            randomCanditaList.push(count)
            
          }else if (this.PreyCandidatesList[count].voteCount === comparison){
            randomCanditaList.push(count)
            legit = false
          }
          count++
        }
        
        // let theNum = this.PreyCandidatesList[HighIndex].voteCount
        // this.isAnnouncing = true
        
        if(legit){
          console.log('highest got easy ')
          console.log('------')
          // when heighest vote getter is the onlu one
          ultimateIndex = HighIndex
        }else{
          // when there is tie for the top
          console.log('Tie vote for werewolf, going to random')
          console.log(`top getters: ${randomCanditaList}`)
          ultimateIndex = randomCanditaList[ Math.floor(Math.random() * randomCanditaList.length)] 
          
        }

      }

      // exectue right herw
      // let theIndex = this.attackTargetedList[ultimateIndex].targetIndex


      if(this.docsProtectingList.includes(ultimateIndex)){
        this.killSuccess = false
        this.docLog = `Doctor successfully protect [ ${this.gameData.players[ultimateIndex].name} ] from Werewolf team!`
      }else{
        this.killSuccess = true
          this.gameData.players[ultimateIndex].isAlive = false
        this.gameData.players[ultimateIndex].imgLink = 'https://scontent.fhio2-1.fna.fbcdn.net/v/t1.0-9/28166944_157511468242164_696203289464668160_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=34aCbjOfiRUAX9nRZwh&_nc_ht=scontent.fhio2-1.fna&oh=4d2f83ad5953e9c225287571460e59f2&oe=606D41C5'

        let theAvenger = this.gameData.players[ultimateIndex]
        let AvenegIndex= theAvenger.dieWith


        if(theAvenger.roll === 'Avenger'){
          if(this.gameData.players[AvenegIndex].isAlive){
            this.gameData.players[AvenegIndex].isAlive = false
            this.gameData.players[AvenegIndex].imgLink = 'https://scontent.fhio2-1.fna.fbcdn.net/v/t1.0-9/28166944_157511468242164_696203289464668160_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=34aCbjOfiRUAX9nRZwh&_nc_ht=scontent.fhio2-1.fna&oh=4d2f83ad5953e9c225287571460e59f2&oe=606D41C5'
            this.avengeLog = ''

            this.avengeLog = `${theAvenger.name} killed ${this.gameData.players[AvenegIndex].name} ( ${this.gameData.players[AvenegIndex].roll} ) just before died.`

          }
        }
      }



      

      // set all the targets for the werewolf so it will easy to access later
      let wolfCount = 0
      while(wolfCount < this.IndexOfAliveWerewolf.length){
        this.gameData.players[wolfCount].killTarget = ultimateIndex
        wolfCount++
      }






      // medium revive if necessary 
      let MediumCount = 0
      let theMediumIndex = null
      let i =0

      if(this.reservationForMedium.length !== 0){
        console.log('called the function')
        while(MediumCount < this.reservationForMedium.length){
          theMediumIndex =  this.reservationForMedium[MediumCount]
          this.gameData.players[theMediumIndex].isAlive = true
          this.reviveLog.push( `Medium revived ${this.gameData.players[theMediumIndex].name} !`)
          
          i =0
          while(i < this.rolesList.Village.length){
            if(this.rolesList.Village[theMediumIndex].name === this.gameData.players[i].roll){
              this.gameData.players[theMediumIndex].imgLink = this.rolesList.Village[i].imgLink
            }
            i++ 
          }
        }
        MediumCount++
      }
      this.reservationForMedium = []




      // If game should continue or not

      if(this.PercentageOfWerewolf > 50){
        this.readyToPlay = false
        this.winnerTeam = 'Werewolf'
        alert('The game is over. Werewolf Won')
      }else if(this.PercentageOfWerewolf === 0){
        this.readyToPlay = false
        this.winnerTeam = 'Village'
        alert('The game is over. Village Won!')
      }



      // clearing the voting datas
      let count = 0
      while(count < this.gameData.players.length){
        this.gameData.players[count].votingFor = ''
        count++
      }

      
    },

    executeDayActions(){
      // first of all, if selecgting player is nececcasry or not
      // console.log('eveybody voted')

      if(this.currentPlayer.roll === 'Werewolf'){
        this.selectingPlayer = true
      }else{
        this.selectingPlayer = false
      }

      // clear the all target
      let count = 0
      while(count < this.gameData.players.length){
        this.gameData.players[count].killTarget = ''
        count++
      }

      // excute by the village
      // if the highest is overlaped then cancel
      // if the heighest is not even the more than 0.5 the no

      let halfNum = this.survivors.length / 2
      count = 0
      let comparison = 0
      let legit = true;
      let theIndex  = '';
      // console.log(this.votedList[3].voteCount)
      while(count < this.votedList.length){
        if(this.votedList[count].voteCount > comparison){ 
          theIndex = count
          comparison =this.votedList[count].voteCount
          legit = true
          
        }else if (this.votedList[count].voteCount === comparison){
          legit = false
        }
        count++
      }

      if(theIndex === ''){
        this.announcingMessage ='No one voted'
        return
      }
      
      let theNum = this.votedList[theIndex].voteCount
      this.isAnnouncing = true
      this.gameData.days[this.gameData.days.length -2].voteFinished = true
      if(theNum >= halfNum){
        if(legit){
          this.announcingMessage ='Village decided to kil'+ ` ${this.gameData.players[theIndex].name}. \n`
          this.announcingMessage = this.announcingMessage + '\n' +  `${this.gameData.players[theIndex].name} was ${this.gameData.players[theIndex].roll}`
          this.gameData.players[theIndex].isAlive = false
          this.gameData.players[theIndex].imgLink = 'https://scontent.fhio2-1.fna.fbcdn.net/v/t1.0-9/28166944_157511468242164_696203289464668160_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=34aCbjOfiRUAX9nRZwh&_nc_ht=scontent.fhio2-1.fna&oh=4d2f83ad5953e9c225287571460e59f2&oe=606D41C5' 


          let theAvenger = this.gameData.players[theIndex]
          let AvenegIndex= theAvenger.dieWith


          if(theAvenger.roll === 'Avenger'){
            if(this.gameData.players[AvenegIndex].isAlive){
              this.gameData.players[AvenegIndex].isAlive = false
              this.gameData.players[AvenegIndex].imgLink = 'https://scontent.fhio2-1.fna.fbcdn.net/v/t1.0-9/28166944_157511468242164_696203289464668160_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=34aCbjOfiRUAX9nRZwh&_nc_ht=scontent.fhio2-1.fna&oh=4d2f83ad5953e9c225287571460e59f2&oe=606D41C5'
              this.avengeLog = ''

              this.avengeLog = `${theAvenger.name} killed ${this.gameData.players[AvenegIndex].name} ( ${this.gameData.players[AvenegIndex].roll} ) just before died.`

            }
          
          }
          if(this.gameData.players[theIndex].roll === 'Fool'){
            this.readyToPlay = false
            this.winnerTeam = `${this.gameData.players[theIndex].name}'s team(fool) won!`
            alert('The game is over. Fool just Won by getting lynched!')
          }
        }else{
          this.announcingMessage ='tie vote!, couldnot decide'
        }
      }else{
        if(theNum !== 0){
          this.announcingMessage =`Didn't get enough: ` + `${halfNum}`
        }
      }





      // Check if the game should go on or not

      if(this.PercentageOfWerewolf > 50){
        this.readyToPlay = false
        
        this.winnerTeam = 'Werewolf'
        alert('The game is over. Werewolf Won')
      }else if(this.PercentageOfWerewolf === 0){
        this.readyToPlay = false
        this.winnerTeam = 'Village'
        alert('The game is over. Village Won!')
      }



      // // kill and protect
      // // check if we have to continue the game or not
      // // clear the target after that
      // let count = 0;
      // while(count < this.attackTargetedList.length){
      //   let theIndex = this.attackTargetedList[count].targetIndex
      //   console.log(`killing ${theIndex}`)
      //   // this.gameData.players[theIndex].name= 'Dead'
      //   this.gameData.players[theIndex].isAlive = false
      //   this.gameData.players[theIndex].imgLink = 'https://scontent.fhio2-1.fna.fbcdn.net/v/t1.0-9/28166944_157511468242164_696203289464668160_n.jpg?_nc_cat=108&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=34aCbjOfiRUAX9nRZwh&_nc_ht=scontent.fhio2-1.fna&oh=4d2f83ad5953e9c225287571460e59f2&oe=606D41C5'
      //   count++
      // }


      // // If game should continue or not

      // if(this.PercentageOfWerewolf > 50){
      //   this.readyToPlay = false
      //   alert('The game is over. Werewolf Won')
      // }else if(this.PercentageOfWerewolf === 0){
      //   this.readyToPlay = false
      //   alert('The game is over. Village Won!')
      // }

      // // this.selectingPlayer = true


      // // this.isReadyToPlya = false

      
      // // console.log(this.gameData.players[])

      // // clear the everybody' target


      
      // clear the all votes for at night section

      this.selectingPlayer = false

    },
    
    clickThePlayer(i){
      let targetCanditate = this.gameData.players[i]
      // let  Canditate = this.gameData.players[i]
      if(this.timeCondition ==='Night' && this.currentPlayer.roll === 'Werewolf'){
        // let targetCanditate = this.gameData.players[i]
        // chekck if it is not you or not, alert you cant target your self
        // check if deat or same team or not
        // 
        if(this.selectingPlayer){
          if(this.currentPlayer.name === targetCanditate.name){
            alert('You cannot trarget yourself')
            return 
          }
          if(targetCanditate.team === this.currentPlayer.team){
            alert('You cannot target you teammate')
            return 
          }
          if(!targetCanditate.isAlive ){
            alert('You cannot target dead player')
            return 
          }

          let r= confirm(`Is [ ${targetCanditate.name} ] your target?`);
          if(!r){
            return;
          }

          this.selectingPlayer  = false
          this.gameData.players[this.currentIndex].killTarget = i;

        }else{
          return
        }
      
      }else if(this.timeCondition === 'Day' ){

        if(this.selectingPlayer){
          if(this.currentPlayer.name === targetCanditate.name){
            alert('You cannot vote for yourself')
            return 
          }
          if(!targetCanditate.isAlive ){
            alert('You cannot vote for dead player')
            return 
          }

          let r= confirm(`Are you voting for [ ${targetCanditate.name} ] ?`);
          if(!r){
            return;
          }

          this.selectingPlayer  = false
          this.gameData.players[this.currentIndex].votingFor = i;
        }else{
          return
        }
      }

      // console.log(i)
    },
    selectOne(){
      this.selectingPlayer = true
      console.log('juhu')
      // disable yourself or the one whos dead  or the whole werewolf team
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


    clickPrey(i){
      if(!this.selectingPlayer){
        return
      }

      let targetCanditate = this.gameData.players[i]

      // chekck if it is not you or not, alert you cant target your self
      // check if deat or same team or not
      // 
      
      if(this.currentPlayer.name === targetCanditate.name){
        alert('You cannot trarget yourself')
        return 
      }
      if(!targetCanditate.isAlive ){
        alert('You cannot target the dead player')
        return 
      }
      if(targetCanditate.team === 'Werewolf' ){
        alert('You cannot target the other werewolf')
        return 
      }

      // let iCount =0

      // while(iCount < this.IndexOfAliveWerewolf.length){
      //   if(currentPlayersIndex === this.IndexOfAliveWerewolf){
      //     iCount++
      //   }else{


      //     iCount++;
      //   }
      // }
      

      let r= confirm(`Is [ ${targetCanditate.name} ] your target?`);
      if(!r){
        return;
      }

      this.selectingPlayer  = false
      this.gameData.players[this.currentIndex].killTarget = i;
    },
    clickSeer(i){
      if(!this.selectingPlayer){
        return
      }
      let targetCanditate = this.gameData.players[i]
      if(!targetCanditate.isAlive){
        alert(`Can't choose dead player`)
        return
      }
      if(targetCanditate.name === this.currentPlayer.name){
        alert(`Can't choose yourself`)
        return
      }


      let r= confirm(`Would you like to check [ ${targetCanditate.name} ] ?`);
      if(!r){
        return;
      }


      switch(this.currentPlayer.roll){
        case 'Seer':
          this.discovery = `${targetCanditate.name} is ${targetCanditate.roll}`
          break;

        case 'Aura Seer':
          if(targetCanditate.roll === 'Gunner' ||  targetCanditate.roll === 'Jailer' || targetCanditate.roll === 'Medium' ||  targetCanditate.roll === 'Witch' || targetCanditate.team === 'Solo' ){
            this.discovery = `${targetCanditate.name} has Unknown aura`
          }else if(targetCanditate.team === 'Village'){
            this.discovery = `${targetCanditate.name} has Good aura`
          }else if(targetCanditate.team === 'Werewolf'){
            this.discovery = `${targetCanditate.name} has Evil aura`
          }
          break


      }
      this.selectingPlayer = false
    },
    clickAvenge(i){
      if(!this.selectingPlayer){
        return
      }
      let targetCanditate = this.gameData.players[i]
      if(!targetCanditate.isAlive){
        alert(`Can't choose dead player`)
        return
      }
      if(targetCanditate.name === this.currentPlayer.name){
        alert(`Can't choose yourself`)
        return
      }


      let r= confirm(`Are you revenging on [ ${targetCanditate.name} ] when you die?`);
      if(!r){
        return;
      }


      this.gameData.players[this.currentIndex].dieWith = i 
      

      this.selectingPlayer = false
    },
    clickDoctor(i){
      if(!this.selectingPlayer){
        return
      }
      let targetCanditate = this.gameData.players[i]
      if(!targetCanditate.isAlive){
        alert(`Can't choose dead player`)
        return
      }
      if(targetCanditate.name === this.currentPlayer.name){
        alert(`Can't choose yourself`)
        return
      }


      let r= confirm(`Would you like to protect [ ${targetCanditate.name} ] from Werewolf?`);
      if(!r){
        return;
      }


      this.gameData.players[this.currentIndex].protecting= i 
      

      this.selectingPlayer = false
    },

    clickMediium(i){
      if(!this.selectingPlayer && (this.currentPlayer.amountOfAbility === 0)){
        return
      }
      let targetCanditate = this.gameData.players[i]
      if(targetCanditate.isAlive){
        this.selectingPlayer = false
        alert(`You have to choose a dead player`)
        return
      }
      if(targetCanditate.team === 'Werewolf' || targetCanditate.team === 'Solo'){
        alert(`You can't revive a player from  wolf or solo team`)
        return
      }


      let r= confirm(`Would you like to revive [ ${targetCanditate.name} ] ?`);
      if(!r){
        return;
      }

      // reduce the num for the revive but wait for the actual step
      this.gameData.players[this.currentIndex].amountOfAbility = this.gameData.players[this.currentIndex].amountOfAbility -1
      this.reservationForMedium.push(i); 
      this.instantMediumMessage=  `You jsut revived ${this.gameData.players[i].name} !`
      

      this.selectingPlayer = false
    },




    clickVote(i){
      let targetCanditate = this.gameData.players[i]
      // console.log(i)

      if(this.currentPlayer.name === targetCanditate.name){
        alert('You cannot vote for yourself')
        return 
      }
      if(!targetCanditate.isAlive ){
        alert('You cannot vote for dead player')
        return 
      }
      if(this.currentPlayer.team === 'Werewolf' &&  targetCanditate.team === 'Werewolf'){
        let c= confirm(`Are you voting for the same werewolf [ ${targetCanditate.name} ] ?`);
        if(!c){
          return;
        }else{
          this.selectingPlayer  = false
          this.gameData.players[this.currentIndex].votingFor = i;
          return
        }
      }

      let r= confirm(`Are you voting for [ ${targetCanditate.name} ] ?`);
      if(!r){
        return;
      }

      // this.selectingPlayer  = false 
      this.gameData.players[this.currentIndex].votingFor = i;
        
    },
    



  },
  watch:{
  },

  mounted(){
    // this.gameData.days.push({Nightactions: [], currentPlayersIndex: 0, isNightOver: false, isDayOver: false});
    // console.log(this.availableList)
    // this.refresh()
    // console.log(this.rolesList.Village)
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
  margin-top: 15px;
}


.role-card {
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

.player-card{
  float: left;
  /* display: flex; */
  font-size: 60%;
  /* position: absolute; */
  width: 22%;
  /* top: 20px; */
  height:115px;
  /* margin-top: 50px; */
  /* width: 60em; */
  /* background-color: #304455; */
  /* border: solid 1px black; */
  margin-right: 1%;
  margin-left: 1%;
  margin-bottom: 3%;
  position: relative;
}

.border-black{
  border: solid 1px black;
}

.border-red{
  border: solid 1px red;
}

.border-green{
  border: solid 1px green;
}



.role-card span,
.player-name{
  position: absolute;
  bottom: 18px;
  left: 0;
  right: 0;
  color: black;
}

.player-roll{
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  color: red
}



.trueAva{
  background-color: white;
}
.falseAva{
  background-color: grey;
}
.counter{
  margin-right: 10px;
  margin-left: 10px;
}

.selectedCounter{
  color:red;  
}

.dead{
  background-color: grey;
}

.selectingPlayer{
  /* background-color: blue; */
  opacities: 0.3;
}


</style>
