import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/waitingroom.css';

const WaitingRoom = ({ auth, setVwarToken, setVwarTokenExpiresIn }) => {
  const [position, setPosition] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [isFirstInQueue, setIsFirstInQueue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const enterQueue = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/assign_queue_number`);
      const event_id = response.data.data.api_request_id;
      setEventId(event_id);

      // Retrieve queue position using the event ID
      await axios.get(`${process.env.REACT_APP_API_URL}/check_queue_number?request_id=${event_id}`)
        .then(queueResponse => {
          if (queueResponse.data.token && queueResponse.data.token.access_token) {
            setVwarToken(queueResponse.data.token.access_token);
            setVwarTokenExpiresIn(queueResponse.data.token.expires_in);
            setIsFirstInQueue(true);
          } else {
            setIsFirstInQueue(false);
            const queue_position = queueResponse.data.queue_number;
            setPosition(queue_position);
            
            const total_users = axios.get(`${process.env.REACT_APP_API_URL}/waiting_num`)
              .then(totalUsersResponse => {
                setTotalUsers(totalUsersResponse.data.waiting_number);
                setEstimatedTime(queue_position * 2);
              })
              .catch(error => {
                console.error('Error getting total users:', error);
              });
          }
        })
        .catch(error => {
          console.error('Error checking queue position:', error);
          setIsFirstInQueue(false);
        });
    } catch (error) {
      console.error('Error entering queue:', error);
      setIsFirstInQueue(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId !== null) {
      const interval = setInterval(async () => {
        try {
          const queueResponse = await axios.get(`${process.env.REACT_APP_API_URL}/check_queue_number?request_id=${eventId}`);
          const total_users = await axios.get(`${process.env.REACT_APP_API_URL}/waiting_num`);
          
          setTotalUsers(total_users.data.waiting_number);
          
          if (queueResponse.data.token && queueResponse.data.token.access_token) {
            setVwarToken(queueResponse.data.token.access_token);
            setVwarTokenExpiresIn(queueResponse.data.token.expires_in);
            clearInterval(interval);
          } else {
            setIsFirstInQueue(false);
            const queue_position = queueResponse.data.queue_number;
            setPosition(queue_position);
            setEstimatedTime(queue_position * 2);
          }
        } catch (error) {
          console.error('Error checking queue position:', error);
          setIsFirstInQueue(false);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [eventId]);

  const handleProceed = () => {
    navigate('/notes');
  };

  return (
    <div className='waiting-room-div'>
      <h1>Waiting Room</h1>
      {eventId === null ? (
        <>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <button onClick={enterQueue}>Enter Queue</button>
          )}
        </>
      ) : (
        <>
          {!isFirstInQueue ? (
              <>
                <p>Your current position in the queue: {position}</p>
                <p>Total number of users in the queue: {totalUsers}</p>
              </>
          ) : (
            <p>You can now proceed from the queue.</p>
          )}
          <button onClick={handleProceed} disabled={!isFirstInQueue}>
            Proceed
          </button>
        </>
      )}
    </div>
  );
};

export default WaitingRoom;