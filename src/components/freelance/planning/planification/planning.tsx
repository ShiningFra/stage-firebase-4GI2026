import { useState, useMemo, useContext, useEffect, KeyboardEvent, FormEvent } from 'react';
import dayjs from 'dayjs';
import { GlobalContext } from '../context/GlobalContext';
import { getMonth } from '../utils/util';
import { Event } from '../interfaces/types';
import { PercentLevel } from '../interfaces/types';
import { formError } from '../interfaces/types';
import CommonFom from '../forms/CommonFom';
import Alert from '../alerts/alert';


const CalendarPage: React.FC = () => {

  const { MonthID, setMonthID } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("")
  const [state, setState] = useState("")
  const [criterebuy, setCriterebuy] = useState<string | null>(null)
  const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
  const [prixtotal, setPrixtotal] = useState<number | null>(null)
  const [prixtotalreduit, setPrixtotalreduit] = useState<number | null>(null)
  const [percent, setPercent] = useState<number | null>(null)


  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"

  const [showForm, setShowForm] = useState<boolean>(false);

  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
  const [errors, setErrors] = useState<formError>({
    endDate: '',
    startDate: ''
  })
  const [showAlert, setShowAlert] = useState(false);


  const handleClose = () => {
    setShowAlert(false);
    setErrors({
      endDate: '',
      startDate: ''
    })
    setShowForm(false)
  };

  const sortedEvents = useMemo(() => {
    return eventsMonth.sort((a, b) => dayjs(a.startDateTime).diff(dayjs(b.startDateTime)));
  }, []);

  const groupedEvents = useMemo(() => {
    const result: { [year: number]: { [month: number]: Event[] } } = {};

    sortedEvents.forEach((event) => {
      const eventYear = dayjs(event.startDateTime).year();
      const eventMonth = dayjs(event.startDateTime).month();

      if (!result[eventYear]) {
        result[eventYear] = {};
      }

      if (!result[eventYear][eventMonth]) {
        result[eventYear][eventMonth] = [];
      }

      result[eventYear][eventMonth].push(event);
    });

    return result;
  }, [sortedEvents]);


  //gestion du changement des mois et indice de mois
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);


  useEffect(() => {
    setCurrentMonthIndex(monthIndex)
  }, [monthIndex])



  const handleKeyPress = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      handleFormSubmit(e);
    }
  };

  //gestion de la sélection des évènements
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setStartDate(dayjs(event.startDateTime).format('YYYY/MM/DD HH:mm'));
    setEndDate(dayjs(event.endDateTime).format('YYYY/MM/DD HH:mm'));
    setCriterebuy(event.criterebuy)
    setPrixtotal(event.prixtotal)
    setPrixdecritere(event.prixdecritere)
    setShowForm(true);
  };

  //gestion de la soumission du formulaire
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && startDate && criterebuy && prixtotal && prixdecritere && endDate && percent != null && prixtotalreduit) {

      const startDate1 = dayjs(startDate as string);
      const endDate1 = dayjs(endDate as string);
      const currentDate = dayjs().startOf('day')
      const start = dayjs(startDate).startOf('day')


      if (selectedEvent) {

        if (startDate1.isBefore(endDate1)) {
          if (currentDate.isBefore(start) || currentDate.isSame(start)) {
            
            setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setCreatedAt(selectedEvent.createdAt)

            setEventsMonth(eventsMonth.map(ev => ev.PlaningId === selectedEvent.PlaningId ? {
              ...ev,
              title: title, 
              driverId : driverId,
              startDateTime: startDate,
              endDateTime: endDate,
              createdAt: createdAt,
              updatedAt: updatedAt,
              state: state,
              criterebuy: criterebuy,
              prixdecritere: prixdecritere,
              prixtotal: prixtotal,
              percent: percent,
              prixtotalreduit: prixtotalreduit

            } : ev));


            try {
              const response = await fetch(`http://localhost:8080/planing/freelance/update/${selectedEvent.PlaningId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: title,
                  startDateTime: startDate,
                  endDateTime: endDate,
                  createdAt: createdAt,
                  updatedAt: updatedAt,
                  state: state,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                  percent: percent,
                  prixtotalreduit: prixtotalreduit
                }),
              });

              if (response.ok) {
                setShowForm(false);
                setSelectedEvent(null)

                setTitle('');
                setStartDate('');
                setCreatedAt("")
                setUpdatedAt("")
                setEndDate('');
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
                setPercent(null)
                setPrixtotalreduit(null)
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
                }));
                setShowAlert(true);
              }
            } catch (error) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
              }));
              setShowAlert(true);
            }
            
            setSelectedEvent(null)
            //mise à jour après soumission
            setShowForm(false);
            setSelectedEvent(null)

            setTitle('');
            setStartDate('');
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
            setPercent(null)
            setPrixtotalreduit(null)
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              startDate: "La date de debut doit etre après la date d'aujourd'hui ou etre la meme date",
            }));
            setShowAlert(true);
          }
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            endDate: "La date de fin doit être après la date de début",
          }));
          setShowAlert(true);
        }

      } else {
        if (startDate1.isBefore(endDate1)) {
          if (currentDate.isBefore(start) || currentDate.isSame(start)) {
            setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setCreatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
          
            const val: number = MonthID
            setMonthID(val + 1);
            setEventsMonth([...eventsMonth, {
              PlaningId: MonthID,
              driverId : driverId,
              title: title,
              startDateTime: startDate,
              endDateTime: endDate,
              createdAt: createdAt,
              updatedAt: updatedAt,
              state: state,
              criterebuy: criterebuy,
              prixdecritere: prixdecritere,
              prixtotal: prixtotal,
              percent: percent,
              prixtotalreduit: prixtotalreduit

            }]);


            try {
              const response = await fetch('http://localhost:8080/planing/freelance/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: title,
                  driverId: driverId,
                  startDateTime: startDate,
                  endDateTime: endDate,
                  createdAt: createdAt,
                  updatedAt: updatedAt,
                  state: state,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                  percent: percent,
                  prixtotalreduit: prixtotalreduit
                }),
              });

              if (response.ok) {
                setShowForm(false);
                setSelectedEvent(null)

                setTitle('');
                setStartDate('');
                setCreatedAt("")
                setUpdatedAt("")
                setEndDate('');
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
                setPercent(null)
                setPrixtotalreduit(null)
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
                }));
                setShowAlert(true);
              }
            } catch (error) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
              }));
              setShowAlert(true);
            }
            //mise à jour après soumission
            setShowForm(false);
            setSelectedEvent(null)

            setTitle('');
            setStartDate('');
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
            setPercent(null)
            setPrixtotalreduit(null)
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              startDate: "La date de debut doit etre après la date d'aujourd'hui ou etre la meme date",
            }));
            setShowAlert(true);
          }
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            endDate: "La date de fin doit être après la date de début",
          }));
          setShowAlert(true);
        }


      }

    }
  };

  //gestion de l'annulation d'une modification, d'un ajout ou d'une suppression d'un évènement
  const handleCancel = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setTitle('');
    setStartDate('');
    setCreatedAt("")
    setUpdatedAt("")
    setEndDate('');
    setCriterebuy(null)
    setPrixdecritere(null)
    setPrixtotal(null)
    setPercent(null)
    setPrixtotalreduit(null)
  }

  const handleDelete1 = async (id: any) => {

    try {
      const response = await fetch(`http://localhost:8080/planing/freelance/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setShowForm(false);
        setSelectedEvent(null);
        setTitle('');
        setStartDate('');
        setCreatedAt("")
        setUpdatedAt("")
        setEndDate('');
        setCriterebuy(null)
        setPrixdecritere(null)
        setPrixtotal(null)
        setPercent(null)
        setPrixtotalreduit(null)
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
        }));
        setShowAlert(true);
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
      }));
      setShowAlert(true);
    }

    //setEventsMonth(eventsMonth.filter(ev => ev.id !== id));

  };


  //gestion de la suppression d'un évènement
  const handleDelete = (id: number) => {
    setEventsMonth(eventsMonth.filter(ev => ev.PlaningId !== id));
    setShowForm(false);
    setSelectedEvent(null)
    setTitle('');
    setStartDate('');
    setCreatedAt("")
    setUpdatedAt("")
    setEndDate('');
    setCriterebuy(null)
    setPrixdecritere(null)
    setPrixtotal(null)
    setPercent(null)
    setPrixtotalreduit(null)
  };
  // definition des couleurs des évènements
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  useEffect(() => {
    if (prixdecritere && startDate && endDate && percent != null) {
      if (criterebuy === "hour") {
        const total = ((dayjs(endDate).diff(startDate) / 3600000) * prixdecritere).toFixed(2);
        setPrixtotal(parseFloat(total))
        if (prixtotal) {
          setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
        }

      } else if (criterebuy ==="day") {
        const total = (((dayjs(endDate).diff(startDate) / 3600000) / 24) * prixdecritere).toFixed(2);
        setPrixtotal(parseFloat(total))
        if (prixtotal) {
          setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
        }
      } else if (criterebuy ==="km" || criterebuy ==="any") {
        setPrixtotal(prixdecritere);
        if (prixtotal) {
          setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
        }
      }
    }
  }, [prixdecritere, startDate, endDate, criterebuy, prixtotal, percent, prixtotalreduit]);





  return (
    <div className="flex-1 py-8 text">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {Object.keys(groupedEvents)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((year) => (
              <div key={year}>
                <h2 className="font-bold title p-4 flex items-center justify-center">
                  {parseInt(year) === selectedYear ? (
                    <button
                      onClick={() => setSelectedYear(parseInt(year))}
                    >
                      {year}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedYear(parseInt(year))}
                      className="text-gray-600 hover:cursor-pointer"
                    >
                      {year}
                    </button>
                  )}
                </h2>

                {Object.keys(groupedEvents[parseInt(year)]).map((month) => (
                  <div key={month} className="space-y-4">
                    <h3 className="m-7 font-bold ">
                      {dayjs(`${year}-${parseInt(month) + 1}-01`).format('MMMM')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                      {groupedEvents[parseInt(year)][parseInt(month)].map((event) => (
                        <div
                          key={event.PlaningId}
                          className="border cursor-pointer p-3 shadow-md rounded-lg hover:shadow-planing hover:shadow-xl hover:bg-third transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          <h4 className="text-center font-bold mb-2">{event.title}</h4>
                          <div className="flex flex-col">
                            <span className="font-medium">
                            <span className="opacity-[60%]">Start at:</span>  {dayjs(event.startDateTime).format('DD/MM/YYYY HH:mm')}
                            </span>
                            <span className="font-medium">
                              <span className="opacity-[60%]">End at:</span> {dayjs(event.endDateTime).format('DD/MM/YYYY HH:mm')}
                            </span>
                            <span className="font-medium">
                              <span className="opacity-[60%]">Payment Option:</span>  per {event.criterebuy}
                            </span>
                            <span className="font-medium">
                             <span className="opacity-[60%]">Price per unit:</span>  {event.prixdecritere} XAF
                            </span>
                            <span className="font-medium">
                              <span className="opacity-[60%]">Discount:</span>  {event.percent} %
                            </span>
                            <span className="font-medium">
                              <span className="opacity-[60%]">Total price:</span>  {event.prixtotal} XAF
                            </span>
                            <span className="font-medium">
                              <span className="opacity-[60%]">Total with discount:</span>  {event.prixtotalreduit} XAF
                            </span>
                            <span className="font-medium">
                              <span className="opacity-[60%]">Created at:</span>   {event.createdAt} 
                            </span>
                            <span className="font-medium">
                              <span className="opacity-[60%]">Updated at</span> :{event.updatedAt} 
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
                  <button
                    className="mt-4 bg-primary flex text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => setShowForm(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add a slot
                  </button>
                  <CommonFom
                  isOpen={showForm}
                  handleClose={handleClose}
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setCriterebuy={setCriterebuy}
                  criterebuy={criterebuy}
                  setPercent={setPercent}
                  percent={percent}
                  setPrixtotal={setPrixtotal}
                  prixtotal={prixtotal}
                  prixtotalreduit={prixtotalreduit}
                  title={title}
                  prixdecritere={prixdecritere}
                  setPrixdecritere={setPrixdecritere}
                  setTitle={setTitle}
                  
                  handleCancel={handleCancel}
                  handleDelete={handleDelete}
                  selectedEvent={selectedEvent}
                  handleKeyPress={handleKeyPress}
                  handleFormSubmit={handleFormSubmit}

                  />
      </div>
      <div>
        {showAlert && (
          <Alert
           errors={errors}
           handleClose={handleClose}
          />
        )}


        </div>
      </div>
    </div>
  );
};

export default CalendarPage;