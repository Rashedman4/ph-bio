"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  email: string;
  created_at: string;
  phonenumber: string;
  provider_email: string;
}

interface Subscription {
  id: number;
  email: string;
  package_name: string;
  price: number;
  end_date: string;
}

export default function AdminHome() {
  const [waitlistUsers, setWaitlistUsers] = useState([]);
  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest users
        const usersResponse = await fetch("/api/admin/users");
        if (usersResponse.ok) {
          const userData = await usersResponse.json();
          setLatestUsers(userData.users);
          setTotalUsers(userData.total);
        }

        // Fetch subscriptions
        const subsResponse = await fetch("/api/admin/subscriptions");
        if (subsResponse.ok) {
          const subsData = await subsResponse.json();
          setSubscriptions(subsData);
        }

        // Existing waitlist fetch
        const waitlistResponse = await fetch("/api/wait-list");
        if (waitlistResponse.ok) {
          const waitlistData = await waitlistResponse.json();
          setWaitlistUsers(waitlistData);
        }
      } catch (error) {
        setError("Failed to fetch data: " + error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-royalBlue">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-royalBlue">
            Latest Enrolled Users
            <span className="text-sm ml-2 text-gray-500">
              (Total Users: {totalUsers})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.provider_email || user.email}</TableCell>
                    <TableCell>{user.phonenumber || "Not provided"}</TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), "PPP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-royalBlue">
            Active Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>{sub.package_name}</TableCell>
                    <TableCell>${sub.price}</TableCell>
                    <TableCell>
                      {format(new Date(sub.end_date), "PPP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-royalBlue">
            Waitlist for Upcoming Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {waitlistUsers.map((user: any) => (
                <div key={user.user_id} className="border-b pb-2">
                  <p className="font-medium">
                    <span className="text-brightTeal">-</span>{" "}
                    {user.provider
                      ? `${user.provider_email} (${user.provider})`
                      : user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Joined {formatDistanceToNow(new Date(user.created_at))} ago
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
