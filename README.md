Instructions:

Live build link:

This exercise was written with react, and boostrapped with create-react-app. To run a copy locally:

1) git clone "https://github.com/jeremyburr/flashpoint-exercise.git"
2) npm install
3) npm start (nagivate to localhost:3000)

Simply 
Coding Exercise:

I improvised a large part of this exercise, due to limitations of the PushShift API (features still under development or not working as intended), as well as API throttling. 
- The initial list is only 5 topics (prevent throttling), but the autocomplete function includes all of the start topics. 
- I created a "subscribers" score (aggregation of total subscribers for each topic's subreddits), as PushShift had no endpoints for topic voting 
- With more time, I would have attempted to extract more information from pushshift to meet other features in the task details.  

My answers: 

1) Javascript passes its data type primitives by value and its objects using "call by sharing", closely related to pass by reference. Once the passed object has been changed, its original reference object remains unaffected.
2) This will return undefined. Once setTimeout executes, the loop has already finished and i is no longer accessible.
3) Start by outlining the requirements of the comparison and its objects. The more complex the objects, the more demanding the comparison.

- Ordered methodless JSON objects could be compared simply with JSON.stringify(object1) === JSON.stringify(object2) 
- But, with more detailed objects, much more needs to be considered, including data types, argument references, object constructors and prototypes

4) I understand recursion and the fibonacci sequence. But, not sure how to implement this. Sorry!

React Questions

1) 
- Birth / initialization: The initial set of props and state are provided to a component. The start configuration.
- Mounting: The component is rendered to the DOM (componentWillMount() followed by componentDidMount()) - Operations which require a DOM layout can be written here.
- Updating: A lot is happening. Components re-render based on receiving new props or a state change. Lifecycle hooks include componentWillReceiveProps(), shouldComponentUpdate(), componentWillUpdate(), render(), and componentDidUpdate().
- Unmounting: The component is umounted from the DOM. Unregistring / cleanup done here. 

2) The reducer reduces state to an accumulation based on actions. This significantly reduces overhead related to changing state in complex ways. 

3) If I understand the question, simply import the components, then include them when rendering. Example:

import Component1 from './Component1.js'
import Component2 from './Component2.js'

class Component3 extends Component {
....
  render() {
    return (
      <Component1 />
      <Component2 /> 
    )
  }

}

Alternatively, this question refers to Higher-Order-Components?
