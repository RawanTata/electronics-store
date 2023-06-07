import React, { useContext } from 'react'
import styles from "../css/Device.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { DevicesContext, IDevice } from '../context/DevicesContext';
import { useNavigate } from 'react-router-dom';

interface DeviceProps{
    id: number,
    name: string,
    model: string,
    description: string,
    url: string,
    price: string,
    category_id: number,
    isVisible: boolean,
    setIsVisible: (isVisible: boolean) => void
}

const Device = ({id, name, category_id , model, description, url, price, isVisible, setIsVisible} : DeviceProps) => {
  const navigate = useNavigate();
  const { setSelectedDevice, cart, setCart } = useContext(DevicesContext);
  const handleClick = () => {
    setSelectedDevice({
      id,
      name,
      model,
      description,
      url,
      price,
      category_id
    });
    navigate(`/item/${name} ${model}`);
  }
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(!isVisible){
      setIsVisible(true);
      setTimeout(() => {
          setIsVisible(false);
      }, 1950);
    }
    const newCart = setNewCart([]);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  }

  function setNewCart(newCart: IDevice[]){
    const item = {
        id,
        name,
        model,
        description,
        url,
        price,
        category_id,
        quantity: 1
    };
    const index = cart.findIndex(device => device.id === item.id);
    if(index !== -1){
      ++cart[index].quantity!;
      newCart = [...cart];
    }
    else{
      newCart = [...cart, item];
    }
    return newCart;
  }

  return (
    <article className={styles.device_article} onClick={handleClick}>
        <img loading='lazy' className={styles.device_image} src={url} alt="Device image." />
        <h3 className={styles.device_title}>{`${name} ${model}`}</h3>
        <div className={styles.price_div}>
          <p className={styles.price}>{price}€</p>
          <button onClick={e => handleButtonClick(e)} className={styles.button_icon}><FontAwesomeIcon className={styles.cart} icon={faCartShopping}></FontAwesomeIcon></button>
        </div>
    </article>
  )
}

export default Device
