const express = require('express');
const app = express();
const port = 3000;

const url = require('url');

const fs = require('fs');

const multer = require('multer');
const upload = multer({ dest: 'img/' });