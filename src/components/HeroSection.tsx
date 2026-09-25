import {useState, useEffect} from 'react';
import {Box,MobileStepper, Button,} from "@mui/material";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const heroImages = [
    {label:'image 1', imgPath:'/images/image1.png'},
    {label:'image 2', imgPath:'/images/image2.png'},
    {label:'image 3', imgPath:'/images/image3.png'},
]

export default function HeroSection() {
    const [activeStep, setActiveStep ] = useState(0);
    const maxSteps = heroImages.length;
    const handleNext = () => {
        setActiveStep((prevActiveStep)=> (prevActiveStep+1)%maxSteps);
    }
    const handlePrev = ()=> {
        setActiveStep((prevActiveStep)=> (prevActiveStep-1 + maxSteps )%maxSteps);
    }
    useEffect(()=>{
      const timer = setInterval(()=>{
        handleNext()
      },6000)
      return () => {
        clearInterval(timer);
      }
    },[]);

  return (
    <Box sx={{maxWidth:1280, flexGlow:1 , position:"relative", margin:'auto'}}>
      <Box
        component='img'
        sx={{
          height: '100%',
          width: '100%',
            display: 'block',
          overflow: 'hidden',
        }}
        src={heroImages[activeStep].imgPath}
        alt={heroImages[activeStep].label}
      />

      <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button size="small" onClick={handleNext}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handlePrev}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
          sx={{ bgcolor: 'transparent', mt: 1 }}
      />

    </Box>
  );
}