// RideQueue — Uber-style dispatch queue in C++ (circular array)
// Compile: g++ -std=c++17 -O2 -o ridequeue ridequeue.cpp && ./ridequeue
#include <cstring>
#include <iomanip>
#include <iostream>
#include <string>

const int CAPACITY = 8;

struct RideRequest {
    int id;
    char rider[30];
    char pickup[30];
    char dropoff[30];
};

struct RideQueue {
    RideRequest data[CAPACITY];
    int front = 0;  // index of next rider to serve
    int count = 0;  // logical size

    bool empty() const { return count == 0; }
    bool full() const { return count == CAPACITY; }
    int size() const { return count; }
    int rearIndex() const { return (front + count) % CAPACITY; } // next free slot

    bool enqueue(int id, const char* rider, const char* pickup, const char* dropoff) {
        if (full()) { std::cout << "queue full: rider must wait before requesting\n"; return false; }
        RideRequest& s = data[rearIndex()];
        s.id = id;
        strncpy(s.rider, rider, 29);   s.rider[29] = '\0';
        strncpy(s.pickup, pickup, 29); s.pickup[29] = '\0';
        strncpy(s.dropoff, dropoff, 29); s.dropoff[29] = '\0';
        ++count; // O(1)
        return true;
    }

    bool dequeue(RideRequest& out) {
        if (empty()) { std::cout << "queue empty: no riders to dispatch\n"; return false; }
        out = data[front];              // take the front
        front = (front + 1) % CAPACITY; // advance with wraparound, O(1)
        --count;
        return true;
    }

    const RideRequest* peek() const { return empty() ? nullptr : &data[front]; }

    // cancel booking at position pos (0 = front): shift the tail left, O(n)
    bool cancelAt(int pos) {
        if (pos < 0 || pos >= count) return false;
        for (int k = pos; k + 1 < count; ++k)
            data[(front + k) % CAPACITY] = data[(front + k + 1) % CAPACITY];
        --count;
        return true;
    }

    void print() const {
        std::cout << "queue[" << count << "/" << CAPACITY << "] front=" << front << ": ";
        for (int k = 0; k < count; ++k) {
            const RideRequest& r = data[(front + k) % CAPACITY];
            std::cout << (k ? " -> " : "") << "#" << r.id << " " << r.rider;
        }
        std::cout << "\n";
    }
};

int main() {
    RideQueue q;
    std::cout << "=== RideQueue dispatch (circular array) ===\n";
    q.enqueue(101, "Ama", "Airport", "Osu");
    q.enqueue(102, "Kwame", "Legon", "Makola");
    q.enqueue(103, "Efya", "Tema", "Airport");
    q.print();

    std::cout << "peek: next up is " << q.peek()->rider << "\n";
    RideRequest trip;
    q.dequeue(trip); // dispatch front rider to a driver
    std::cout << "dispatched #" << trip.id << " " << trip.rider << " to Driver-1\n";
    q.print();

    q.enqueue(104, "Yaw", "Osu", "Legon");
    q.enqueue(105, "Akos", "Makola", "Tema");
    q.print(); // rear index wrapped around the end of the array

    q.cancelAt(1); // rider cancels: tail shifts left
    std::cout << "-- after cancelAt(1) --\n";
    q.print();

    while (!q.empty()) { q.dequeue(trip); std::cout << "served #" << trip.id << "\n"; }
    q.dequeue(trip); // underflow demo
    return 0;
}
