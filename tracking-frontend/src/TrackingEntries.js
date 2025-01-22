import React, { useEffect, useState } from "react";

function TrackingEntries() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for form inputs
    const [formData, setFormData] = useState({
        store: "",
        time_of_day: "",
        money_earned: "",
        mileage: "",
        date: "",
        comments: "",
    });

    // State for grouped entries to submit later
    const [groupedEntries, setGroupedEntries] = useState([]);

    // Fetch data on page load
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/entries/")
            .then((response) => response.json())
            .then((data) => {
                setEntries(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Add an entry to the local queue
    const addEntryToQueue = () => {
        if (formData.date) {
            setGroupedEntries([...groupedEntries, { ...formData }]);
            setFormData({
                store: "",
                time_of_day: "",
                money_earned: "",
                mileage: "",
                date: formData.date, // Keep the date fixed
                comments: "",
            });
        } else {
            alert("Please provide a date for the entry.");
        }
    };

    // Submit all queued entries
    const handleSubmitGroupedEntries = () => {
        if (groupedEntries.length === 0) return;

        fetch("http://127.0.0.1:8000/api/entries/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(groupedEntries),
        })
            .then((response) => response.json())
            .then((newEntries) => {
                setEntries([...entries, ...newEntries]);
                setGroupedEntries([]); // Clear the queue
                setFormData({
                    store: "",
                    time_of_day: "",
                    money_earned: "",
                    mileage: "",
                    date: "",
                    comments: "",
                });
            })
            .catch((err) => setError(err.message));
    };

    // Group entries by date
    const groupedByDate = entries.reduce((groups, entry) => {
        const date = entry.date;
        if (!groups[date]) {
            groups[date] = { entries: [], totalMileage: 0, totalMoney: 0 };
        }
        groups[date].entries.push(entry);
        groups[date].totalMileage += parseFloat(entry.mileage);
        groups[date].totalMoney += parseFloat(entry.money_earned);
        return groups;
    }, {});

    // Group totals by month
    const groupedByMonth = entries.reduce((groups, entry) => {
        const [year, month] = entry.date.split("-").slice(0, 2);
        const key = `${year}-${month}`;
        if (!groups[key]) {
            groups[key] = { totalMileage: 0, totalMoney: 0 };
        }
        groups[key].totalMileage += parseFloat(entry.mileage);
        groups[key].totalMoney += parseFloat(entry.money_earned);
        return groups;
    }, {});

    // Group totals by year
    const groupedByYear = entries.reduce((groups, entry) => {
        const year = entry.date.split("-")[0];
        if (!groups[year]) {
            groups[year] = { totalMileage: 0, totalMoney: 0 };
        }
        groups[year].totalMileage += parseFloat(entry.mileage);
        groups[year].totalMoney += parseFloat(entry.money_earned);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
    const sortedMonths = Object.keys(groupedByMonth).sort();
    const sortedYears = Object.keys(groupedByYear).sort();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Submit Entries Here</h1>

            {/* Submission Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addEntryToQueue();
                }}
                style={{ marginBottom: "20px" }}
            >
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="store"
                    value={formData.store}
                    onChange={handleChange}
                    placeholder="Store"
                    required
                />
                <input
                    type="text"
                    name="time_of_day"
                    value={formData.time_of_day}
                    onChange={handleChange}
                    placeholder="Time of Day"
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    name="money_earned"
                    value={formData.money_earned}
                    onChange={handleChange}
                    placeholder="Money Earned"
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="Mileage"
                    required
                />
                <input
                    type="text"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Comments"
                />
                <button type="submit">Add Entry to Queue</button>
                <button
                    type="button"
                    onClick={handleSubmitGroupedEntries}
                    style={{ marginLeft: "10px" }}
                >
                    Submit All Entries
                </button>
            </form>

            {/* Display Queued Entries */}
            {groupedEntries.length > 0 && (
                <div>
                    <h2>Entries to Submit</h2>
                    <table border="1" width="100%">
                        <thead>
                            <tr>
                                <th>Store</th>
                                <th>Time of Day</th>
                                <th>Money Earned</th>
                                <th>Mileage</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedEntries.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.store}</td>
                                    <td>{entry.time_of_day}</td>
                                    <td>${parseFloat(entry.money_earned).toFixed(2)}</td>
                                    <td>{parseFloat(entry.mileage).toFixed(2)} miles</td>
                                    <td>{entry.comments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Display Entries Grouped by Date */}
            {sortedDates.map((date) => {
                const day = groupedByDate[date];
                return (
                    <div key={date}>
                        <h2>{date}</h2>
                        <table border="1" width="100%">
                            <thead>
                                <tr>
                                    <th>Store</th>
                                    <th>Time of Day</th>
                                    <th>Money Earned</th>
                                    <th>Mileage</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {day.entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.store}</td>
                                        <td>{entry.time_of_day}</td>
                                        <td>${parseFloat(entry.money_earned).toFixed(2)}</td>
                                        <td>{parseFloat(entry.mileage).toFixed(2)} miles</td>
                                        <td>{entry.comments}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="2"><strong>Daily Totals:</strong></td>
                                    <td><strong>${day.totalMoney.toFixed(2)}</strong></td>
                                    <td><strong>{day.totalMileage.toFixed(2)} miles</strong></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <hr />
                    </div>
                );
            })}

            {/* Monthly Totals */}
            <h2>Monthly Totals</h2>
            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Total Money Earned</th>
                        <th>Total Mileage</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedMonths.map((month) => (
                        <tr key={month}>
                            <td>{month}</td>
                            <td>${groupedByMonth[month].totalMoney.toFixed(2)}</td>
                            <td>{groupedByMonth[month].totalMileage.toFixed(2)} miles</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Yearly Totals */}
            <h2>Yearly Totals</h2>
            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Total Money Earned</th>
                        <th>Total Mileage</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedYears.map((year) => (
                        <tr key={year}>
                            <td>{year}</td>
                            <td>${groupedByYear[year].totalMoney.toFixed(2)}</td>
                            <td>{groupedByYear[year].totalMileage.toFixed(2)} miles</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TrackingEntries;
