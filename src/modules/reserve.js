import Xclose from '../images/close.svg';
// import countData from './countreservations.js';

const popupReservation = document.querySelector('.reservationPopup');

const loadReserve = async (container, id) => {
  const request = new Request(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/aCIWbt6ixkSGou3TfOCc/reservations?item_id=${id}`);
  const response = await fetch(request);
  const data = await response.json();
  const count = countData(data);
  const divCount = document.querySelector('.countReservations');
  divCount.innerHTML = count;
  let string = '';
  data.forEach((element) => {
    string += `<li class="userDetails">  ${element.username} ${element.start_date}: ${element.end_date}</li>`;
  });
  container.innerHTML = string;
  return count;
};

const addNewReservation = async (idItem, start_date, end_date, username) => {
  const url = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/aCIWbt6ixkSGou3TfOCc/reservations';
  const containerReserves = document.getElementById(`cr${idItem}`);
  const user = username;
  const start_date1 = start_date;
  const end_date1 = end_date;
  const dataToPost = {
    item_id: idItem,
    username: user,
    start_date: start_date1,
    end_date: end_date1,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToPost),
  });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    // throw new Error(message);
  }
  loadReserve(containerReserves, idItem);
};

const openReservations = async (id) => {
  const link = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
  const request = new Request(link);
  const response = await fetch(request);
  const data = await response.json();
  const stringReservePopup = `<article class="popUpReservations" id=${data.objectID}>
                              <img id="xclose" class="xclose" src = "${Xclose}">
                              <section class="imageComments">
                                  <img src=${data.primaryImage} alt="" srcset="">
                              </section>
                              <section class ="detailsComments" >
                                  <p class="titleComments">${data.title}</p>
                                  <ul class="dataPaintingComments">
                                      <li>Year: ${data.accessionYear}</li>
                                      <li>Artist : ${data.artistDisplayName}</li>
                                      <li>Nationality : ${data.artistNationality}</li>
                                      <li>Medium : ${data.medium}</li>
                                  </ul>
                              </section>
                              <section class="divReservations">
                                  <p class="countReservations">Reservations(0)</p>
                                  <ul class="listReservations" id="cr${data.objectID}">
                                  </ul>
                              </section>
                              <section class="addReservation">
                                  <p>Add a reservation</p>
                                  <form id="r${data.objectID}" class="formReserve" action="">
                                  <label>Enter your name:</label>            
                                  <input type="text" id="name" name="user_name" maxlength="30" placeholder="your name" required>
                              
                                  <label>Start Date:</label>
                                  <input type="date" id="startDate"  placeholder="start date" required>
                              
                                  <label>End Date:</label>
                                  <input type="date" id="endDate" placeholder="end date" required>
                                  <button class="reserveButton" type="submit">Reserve</button>
                                  </form>
                              </section>
                            </article>`;
  popupReservation.innerHTML = stringReservePopup;
  popupReservation.setAttribute('style', 'display: block');
  const containerReservations = document.getElementById(`c${data.objectID}`);
  loadReserve(containerReservations, data.objectID);
  const formReservations = document.querySelector(`#r${data.objectID}`);
  formReservations.addEventListener('submit', (e) => {
    e.preventDefault();
    const uN = document.querySelector('#name');
    const start_date = document.querySelector('#startDate');
    const end_date = document.querySelector('#endDate');
    // const { username, start_date, end_date } = formReservations.elements;
    addNewReservation(data.objectID, uN.value, start_date.value, end_date.value);
    formReservations.reset();
  });
};

const closePopUp = (container) => {
  container.setAttribute('style', 'display: none');
};

export {
  Xclose, openReservations, closePopUp, addNewReservation, loadReserve,
};