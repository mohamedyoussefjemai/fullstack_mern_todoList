import axios from "axios";
import React from "react";
import { useGlobalContext } from "../context/GlobalContext";

const ToDoCard = ({ toDo }) => {
  const [content, setContent] = React.useState(toDo.content);
  const [editing, setEditing] = React.useState(false);
  const { toDoComplete, toDoIncomplete, removeToDo, updateToDo } = useGlobalContext() 
  const input = React.useRef(null)
  const onEdit = (e) => {
    e.preventDefault()
    setEditing(true)
    input.current.focus()
  }
  const stopEditing = (e) => {
    e.preventDefault()
    setEditing(false)
    setContent(toDo.content)
  }

  const markAsComplete = e => {
    e.preventDefault()
    axios.put(`/api/todos/${toDo._id}/complete`).then(res => {
      toDoComplete(res.data)
    })
  }

  const markAsIncomplete = e => {
    e.preventDefault()
    axios.put(`/api/todos/${toDo._id}/uncomplete`).then(res => {
      toDoIncomplete(res.data)
    })
  }

  const deleteTodo = e => {
    e.preventDefault()

    if(window.confirm("Are you sure u want to delete this toDo ?"))
    axios.delete(`/api/todos/${toDo._id}`).then(() => {
      removeToDo(toDo)
    })
  }

  const editToDo = e => {
    e.preventDefault()
    axios.put(`/api/todos/${toDo._id}`,{content}).then(res => {
      updateToDo(res.data)
      setEditing(false)
    }).catch(() => {
      stopEditing()
    })
  }

  return (
    <div className={`todo ${toDo.complete ? 'todo--complete' : 'todo--incomplete' }`}>
      <input type="checkbox" checked={toDo.complete} onChange={!toDo.complete ? markAsComplete : markAsIncomplete}/>
      <input type="text" ref={input} value={content} readOnly={!editing} onChange={(e)=> { setContent(e.target.value) }}/>
      <div className="todo__controls">
       { !editing ? ( <>{!toDo.complete && (<button onClick={onEdit}>Edit</button>)} 
        <button onClick={deleteTodo}>Delete</button></>) : (
        <><button onClick={editToDo}>Save</button>
        <button onClick={stopEditing}>Cancel</button></>
        )
       }
        
      </div>
    </div>
  )
}

export default ToDoCard;