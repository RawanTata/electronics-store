import React, { useContext, useEffect, useRef, useState } from 'react'
import Navigation from '../components/Navigation'
import { useParams } from 'react-router-dom'
import styles from "../css/DeviceDetails.module.css"
import { DevicesContext, IDevice } from '../context/DevicesContext'
import DeviceFinder from '../apis/DeviceFinder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import AlertBox from '../components/AlertBox'
import alertBoxStyles from "../css/AlertBox.module.css"


const DeviceDetails = () => {
    const { name } = useParams();
    const { selectedDevice, setSelectedDevice, cart, setCart } = useContext(DevicesContext);
    const [ quantity, setQuantity ] = useState(1);
    const timeout = useRef<number>(null!);
    useEffect(() => {
        window.scrollTo(0,0);
        async function fetchData() {
            try{
                const device = await DeviceFinder(`/device/${name}`);
                setSelectedDevice(device.data.data[0]);
            } catch(e) {
                console.error(e);
            }
        }
        fetchData();
    }, []);
    const animateAlertBox = () => {
        const alertBox = document.getElementById("alert-box");
        clearTimeout(timeout.current);
        alertBox!.className = alertBoxStyles.invisible;
        void alertBox?.offsetWidth;
        alertBox!.className = alertBoxStyles.alert_box + " " + alertBoxStyles.visible;
        timeout.current = setTimeout(() => {
          alertBox!.className = alertBoxStyles.invisible;
        }, 1950);
    }

    const handleClick = () => {
        animateAlertBox();
        const newCart = setNewCart([], quantity);
        localStorage.setItem("cart", JSON.stringify(newCart));
        setCart(newCart);
    }
    function setNewCart(newCart: IDevice[], quantity: number){
        const item = {
            id: selectedDevice.id,
            name: selectedDevice.name,
            model: selectedDevice.model,
            description: selectedDevice.description,
            url: selectedDevice.url,
            price: selectedDevice.price,
            category_id: selectedDevice.category_id,
            quantity
        };
        const index = cart.findIndex(device => device.id === item.id);
        if(index !== -1){
          cart[index].quantity! += quantity;
          newCart = [...cart];
        }
        else{
          newCart = [...cart, item];
        }
        return newCart;
      }

  return (
    <>{
        selectedDevice ? <>
            <AlertBox/>
            <Navigation height={true}/>
            <main id={styles.device_main}>
                <div className={styles.panel}>
                    <div id={styles.device_details}>
                        <h1 id={styles.device_title}>{name}</h1>
                        <p id={styles.description}>{selectedDevice.description}</p>
                        <p id={styles.price}>{selectedDevice.price}€</p>
                        <div className={styles.flex_div}>
                            <button onClick={handleClick} className={styles.cart_button}>Add to cart</button>
                            <div className={styles.quantity_div}>
                                <button onClick={() => quantity >= 2 ? setQuantity(quantity - 1) : null} className={`${styles.quantity_button} ${styles.left}`}><FontAwesomeIcon icon={faMinus}/></button>
                                <input className={styles.quantity_input} readOnly type="text" onChange={e => setQuantity(+e.target.value)} value={quantity}/>
                                <button onClick={() => setQuantity(quantity + 1)} className={`${styles.quantity_button} ${styles.right}`}><FontAwesomeIcon icon={faPlus}/></button>
                            </div>
                        </div>
                    </div>
                    <img id={styles.device_image} src={selectedDevice.url} alt="Device image."/>
                </div>
            </main>
        </> : null
    }</>
  )
}

export default DeviceDetails
