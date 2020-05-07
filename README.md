# Spotify Web Dashboard

## Introduction

This repository contains a Spotify Web Dashboard implementation, built with React. The main motivation for this project was just to test things out and to get familiar with the Spotify SDK.

## Technology stack

- TypeScript
- React.js
- Styled Components
- Redux + RxJS + redux-observable
- Spotify Web API & Playback SDK

## Features

- View the current track information
- Adjust playback volume
- Search for tracks & albums
- View album tracks
- Control playback status
- Play music through the Spotify Web Playback SDK (audio streams to web browser)

## Demo

A working demo is hosted on https://spotti.alehuo.dev

**Note: You will need a Spotify account with Premium subscription!**

The application requires the following scopes: 

- user-read-currently-playing
- user-read-playback-state
- streaming user-read-email 
- user-read-private 
- playlist-read-private 
- user-modify-playback-state

## Installation instructions

You need to create a new application in https://developer.spotify.com/dashboard to get the Client ID.

- Run `npm install`
- Set environment variables (see `.env.example`)
- Run `npm start`

## License

MIT license
