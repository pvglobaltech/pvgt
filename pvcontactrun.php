
<?php
 $host = "localhost";
 $user = "root";
 $password = "";
 $db = "pvform";

 $data = mysqli_connect($host,$user,$password,$db);
 if ($data===false) {
     die("connection"); 
 }
 
 if(isset($_POST['submit']))
 {
     $data_name=$_POST['name'];
     $data_email=$_POST['email'];
     $data_service=$_POST['service'];
     $data_message=$_POST['message'];

     $sql="INSERT INTO pvtable(name,email,service,message) VALUES('$data_name', '$data_email', '$data_service', '$data_message')";

     $result=mysqli_query($data,$sql);

     if($result)
     {
         echo "<center> Thank You For Your Contact! We Shall Get Back To You Soon!</center>";
         echo "<center><span style='color:rgb(238, 106, 18)';CLICK TO RETURN TO HOME PAGE</h2></center>";
         echo "<center><a href='pvhomeme.html'>Home</a></center>";      
     }
     else
     {
         echo "Apply Failed";
     }
 }

?>
