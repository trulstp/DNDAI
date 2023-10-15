import React from "react";

const RandomEncounter = (props) => {
  return (
    <section className='main'>
      {!props.currentTitle && <h1>DNDAI</h1>}
      <div className='picture-section'></div>
      <div className='feed'>
        <ul>
          {props.currentEncounter?.map((chatMessage, index) => (
            <li key={index}>
              <p className='role'>{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className='bottom-section'>
        <div className='input-container'>
          <input
            value={props.value}
            onChange={(e) => props.setValue(e.target.value)}
          />
          <div id='submit' onClick={props.getMessages}>
            ➢
          </div>
        </div>
        <p className='info'>
          DNDAI is a studentproject made by Truls, Dani, and Timothè
        </p>
      </div>
    </section>
  );
};

export default RandomEncounter;
