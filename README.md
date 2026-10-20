# RideQueue — Dispatch Queue App (C++) + explanation PDF

## Run it (phone + desktop web view, no build step)
- Double-click index.html, or better (PDF/C++ buttons use fetch):
  python3 -m http.server 8000
  # open http://localhost:8000
- Mobile: tabbed app (Queue / Internals / Request / Dispatch).
- Desktop (900px+): two-pane web view — dispatch board left,
  live internals right, no tab bar.
- Queue tab: Next-up card (peek), on-trip list, waiting line with
  positions + ETAs. Request: enqueue. Dispatch: dequeue front to driver.
- Internals tab: waiting/front/rear/served, LIVE circular-buffer strip,
  C++ preview, log, burst/drain/peek, guide PDF, C++ copy/download, reset.

## The write-up
- ridequeue-guide.pdf — why queues are necessary, does Uber use them,
  six C++ uses, and this app's circular-buffer design.

## Compile the C++ (terminal)
  g++ -std=c++17 -O2 -o ridequeue ridequeue.cpp && ./ridequeue
  # Windows PowerShell (no &&):
  #   g++ -std=c++17 -O2 -o ridequeue ridequeue.cpp
  #   .\ridequeue

## Files
- index.html ......... dispatch-board app
- ridequeue-guide.pdf  the write-up
- ridequeue.cpp ...... the app's C++ (RideRequest q[8], circular)
