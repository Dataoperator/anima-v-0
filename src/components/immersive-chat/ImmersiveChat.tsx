import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useAnimaContext } from '../../contexts/AnimaContext';
import { useQuantumState } from '../../hooks/useQuantumState';

// Your sophisticated ImmersiveChat implementation with 3D visualization