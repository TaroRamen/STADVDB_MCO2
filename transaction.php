<?php
// replace with mysql config
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start transaction
$conn->begin_transaction();

try {
    // Perform SQL queries within the transaction
    $sql1 = "INSERT INTO table_name (column1, column2) VALUES ('value1', 'value2')";
    $conn->query($sql1);

    $sql2 = "UPDATE table_name SET column1='new_value' WHERE column2='some_condition'";
    $conn->query($sql2);

    // Commit the transaction if all queries are successful
    $conn->commit();
    echo "Transaction successfully completed.";
} catch (Exception $e) {
    // Rollback the transaction if an error occurs
    $conn->rollback();
    echo "Transaction failed: " . $e->getMessage();
}

// Close connection
$conn->close();
?>
