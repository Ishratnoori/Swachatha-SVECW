import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostComplaint.css'; // Import styling

const PostComplaint = () => {
  const navigate = useNavigate();
  const [complaintText, setComplaintText] = useState('');
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setSubLocation(''); // Reset sub-location on location change
  };

  const handleSubLocationChange = (e) => {
    setSubLocation(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !complaintText ||
      !username ||
      !date ||
      !location ||
      (location !== 'mess' && location !== 'garden' && !subLocation)
    ) {
      setError('Please provide all required fields including username, complaint, date, location, and sub-location/room number.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('complaintText', complaintText);
      formData.append('date', date);
      formData.append('location', location);
      formData.append('subLocation', subLocation);
      formData.append('roomNo', roomNo);
      if (image) {
        formData.append('image', image); // Append the uploaded image
      }

      const response = await fetch('http://localhost:5000/submit-complaint', {
        method: 'POST',
        body: formData, // FormData handles headers automatically
      });

      const data = await response.json();

      if (response.ok) {
        alert('Complaint submitted successfully!');
        navigate('/user/dashboard'); // Redirect to dashboard
      } else {
        setError(data.error || 'Failed to submit complaint');
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container">
      <h1>Post a Complaint</h1>

      <button onClick={handleBack} style={{ marginBottom: '20px' }}>
        Back
      </button>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="complaint-form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label htmlFor="location">Location:</label>
        <select id="location" value={location} onChange={handleLocationChange} required>
          <option value="">Select Location</option>
          <option value="college">College</option>
          <option value="hostel">Hostel</option>
          <option value="mess">Mess</option>
          <option value="garden">Garden</option>
        </select>

        {location && (
          <div>
            <label htmlFor="subLocation">Select {location.charAt(0).toUpperCase() + location.slice(1)}:</label>
            <select id="subLocation" value={subLocation} onChange={handleSubLocationChange} required>
              <option value="">Select {location}</option>
              {location === 'college' && (
                <>
                  <option value="blockA">Block A</option>
                  <option value="blockB">Block B</option>
                  <option value="blockC">Block C</option>
                  <option value="blockD">Block D</option>
                  <option value="blockE">Block E</option>
                </>
              )}
              {location === 'hostel' && (
                <>
                  <option value="medha">Medha</option>
                  <option value="sindhu">Sindhu</option>
                  <option value="padmavathi">Padmavathi</option>
                  <option value="ganga">Ganga</option>
                  <option value="yamuna">Yamuna</option>
                  <option value="rajeswari">Rajeshwari</option>
                  <option value="revathi">Revathi</option>
                  <option value="bhuvana">Bhuvana</option>
                </>
              )}
              {location === 'garden' && (
                <>
                  <option value="opengarden">Open Garden</option>
                  <option value="smrithivanam">Smrithi Vanam</option>
                </>
              )}
              {location === 'mess' && (
                <>
                  <option value="annapurnagf">Annapurna Ground Floor</option>
                  <option value="annapurna1f">Annapurna 1st Floor</option>
                  <option value="annapurna2f">Annapurna 2nd Floor</option>
                  <option value="sitasrmess">Sita SR Mess</option>
                  <option value="sitajrmess">Sita Jr Mess</option>
                </>
              )}
            </select>
          </div>
        )}

        {(location === 'college' || location === 'hostel') && subLocation && (
          <div>
            <label htmlFor="roomNo">Room Number:</label>
            <input
              type="text"
              id="roomNo"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*" // Accept only image files
            onChange={handleImageChange}
          />
        </div>

        <label htmlFor="complaintText">Complaint:</label>
        <textarea
          id="complaintText"
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          required
        />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default PostComplaint;