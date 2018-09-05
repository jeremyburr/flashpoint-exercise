import React, { Component } from 'react';
import { Autocomplete } from './Autocomplete.js'
import update from 'immutability-helper'
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      topics: ["Architecture", "Art", "Business", "Education", "Gaming"],
      topic: "Architecture",
    }
    this.inputRef = React.createRef();
  }

    componentDidMount() { 

      // Fetch Initial Reddit Topics

      let topics = this.state.topics;
      let topicsObject = {};
      let apiString = "https://api.pushshift.io/reddit/search/submission/?over_18=false&category="; 

      let fetchActions = topics.map(topic => {
        return (
          fetch(apiString+topic)
          .then(resolve => resolve.json())
        )
      }); 
      let fetchResults = Promise.all(fetchActions); 
      fetchResults.then(data => {
        for (let i = 0; i < data.length; i++) {
          topicsObject[topics[i]] = { 
              subreddits : [],
              subscriberScore: 0 
          }; 

        // Create state objects for each topic - subreddits, submissions, subscriber score 

        let topicObject = topicsObject[topics[i]];
          for (let submission of data[i].data) { 
              topicObject.subscriberScore += submission.subreddit_subscribers;
              topicObject.subreddits.push({
                subreddit: submission.subreddit,
                subscribers: submission.subreddit_subscribers,
                submissions: null,
                display: "block"
              });
          } 
        }

        // Sort list by subscriber score, most to least

        for (let topic in topicsObject) {
          topicsObject[topic].subreddits.sort((a,b) => {
            let aSubs = a.subscribers;
            let bSubs = b.subscribers;
            if (aSubs > bSubs) return -1;
            if (aSubs < bSubs) return 1;
            return 0 
          })
        }
        this.setState({topicsObject: topicsObject}) 

        // Set autocomplete values 

        let topicsArray = ["Architecture", "Art", "Business", "Education", "Entertainment", 
          "Gaming", "General", "Hobbies and Interests", "Law", "Lifestyle", "Locations", "Meta", 
          "Music", "News and Politics", "Science", "Social Science and Humanities", "Sports", 
          "Technology", "Travel"];

        Autocomplete(this.inputRef.current, topicsArray);

      }); 
    
    }

  // Render topic input box
    
    renderInput = () => {
      return (
        <div>
          <div className="autocomplete">
            <input ref={this.inputRef} id="myInput" type="text" name="myCountry" placeholder="Enter Topic" />
          </div>
          <input onClick={this.inputClick} type="submit" />
          <br /><br />
        </div>
       )
    }

    // Generate topics list from state object

      renderTopics = () => { 
          return (
            <div className="topics">
              {this.state.topics.map(topic=>{ 
                return (
                    <span style={this.topicStyle(topic)} key={Math.random()} onClick={()=>this.setTopic(topic)} className="topic">
                      {topic}  
                    </span>
                ) 
              })}
              <h3>Subreddit, Score</h3>
            </div>
          )
      }

    // Render content, show fetch/toggled submissions

    renderContent = () => { 
      return (
        <div>
          {this.state.topicsObject[this.state.topic].subreddits.map((topic,index) => {
            if (topic.submissions === null) {
              return (
               <div onClick={()=>this.showSubmissions(topic.subreddit,index)} key={Math.random()}>
                 <h4 className="subreddit" >{topic.subreddit} ({topic.subscribers})</h4>
               </div>
              )
            } 
            else {
              return (
                <div key={Math.random()}>
                  <h4 className="subreddit" onClick={()=>this.toggleSubmissions(index)}>{topic.subreddit} ({topic.subscribers})</h4>
                    <ul>
                     {topic.submissions.data.map(submission => {
                      return (
                        <li className="submission" style={{display: topic.display}}  key={Math.random()}>
                            {submission.body}
                        </li>
                      )
                     })}
                    </ul>
                 </div>
              ) 
            }
          })}
        </div> 
      ) 
    }

    // Fetch custom topic 

    inputClick = (e) => {
      let topic = this.inputRef.current.value; 
      if (this.state.topics.indexOf(topic) !== -1) {
        console.log('same');
        this.setState({topic});
        return 
      }

      // ( Similar process as in ComponentDidMount)

      let apiString = "https://api.pushshift.io/reddit/search/submission/?category="; 
      fetch(apiString+this.inputRef.current.value)
      .then(resolve => resolve.json())
      .then(data=>{
        let topicObject = {
              subreddits: [],
              subscriberScore: 0
        };
        for (let submission of data.data) { 
            topicObject.subscriberScore += submission.subreddit_subscribers;
            topicObject.subreddits.push({
              subreddit: submission.subreddit,
              subscribers: submission.subreddit_subscribers,
              submissions: null,
              display: "block"
            });
        } 
          topicObject.subreddits.sort((a,b) => {
            let aSubs = a.subscribers;
            let bSubs = b.subscribers;
            if (aSubs > bSubs) return -1;
            if (aSubs < bSubs) return 1;
            return 0 
          })

          // Using 'immutability-helper' for easier state updating

         const newState = update(this.state, {
            topicsObject: {[topic]: {$set: topicObject}  },
            topics: {$push: [topic]} 
            })
        this.setState(newState);
       });        
    }
    
    // Fetch front page preview  

    showSubmissions = (subreddit,index) => {
      fetch("https://api.pushshift.io/reddit/search/comment/?q=*&subreddit="+subreddit+"&after=30d") 
      .then(response => response.json())
      .then(data => {
        const newState = update(this.state, {
            topicsObject: {[this.state.topic]: {
              subreddits: { [index]: { submissions: {$set: data} } } 
            }
           }
         }); 
        this.setState(newState);
      }); 
   }

    // Toggle front page preview

    toggleSubmissions= (index) => {
      console.log('toggle');
      let value = this.state.topicsObject[this.state.topic].subreddits[index].display;
      let nextValue = value === "block" ? "none" : "block";
      console.log(value);
        const newState = update(this.state, {
            topicsObject: {[this.state.topic]: {
              subreddits: { [index]: { display: {$set: nextValue} } } 
            }
           }
         });
        this.setState(newState);
    } 

    // Set current state topic

    setTopic = (topic) => {
      this.setState({topic});
    }

    // Set active topic style

    topicStyle = (topic) => {
        if (this.state.topic === topic) {
          console.log('active');
          return {
            color: "orange",
            fontWeight: "bold"
          }
        }
      }

      // Render only the  active topic to the DOM

      render() {
        if (!this.state.topicsObject) {
          return false
      }
    return (
      <div>
        <h1 >Reddit Topic Fetcher</h1>
        {this.renderInput()}
        {this.renderTopics()}
        {this.renderContent()}
      </div>
    );
  }
}

export default App;



