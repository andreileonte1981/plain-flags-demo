# Plain Flags Demo Controlled App

## Folder Structure

**service** is the back end of the controlled app.

Why use a back end?

The demo app requires feature flag states, which it could update directly from the Plain Flags states service, but it's better to get the states in your back end, then serve it to your front end app with your own custom user authentication and security. The back end and the Plain Flags states service can communicate with simplified security on a secure server, for example by using a Docker network.

**webapp** is the user-facing demo with state controlled by Plain Flags demo users collaboratively, by creating and setting feature flags in the demo dashboard or the mobile apps connected to the demo service.
