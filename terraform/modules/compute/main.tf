# Compute Engine instance for client app (using free tier eligible machine type)
resource "google_compute_instance" "client_app" {
  name         = "client-app-instance"
  machine_type = "e2-micro"  # Free tier eligible
  zone         = var.zone
  project      = var.project_id

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size  = 10  # GB
      type  = "pd-standard"
    }
  }

  network_interface {
    subnetwork = var.subnet_id
    access_config {
      # Ephemeral public IP
    }
  }

  metadata_startup_script = <<-EOF
  #!/bin/bash
  set -e  # Exit on any error

  # Install dependencies
  apt-get update
  apt-get install -y nginx net-tools

  # Make sure directory exists
  mkdir -p /var/www/html

  # Create a simple hello world page
  cat > /var/www/html/index.html <<'EOL'
  <!DOCTYPE html>
  <html>
  <head>
    <title>Make Your Pins</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 50px;
        text-align: center;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      h1 {
        color: #4285f4;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello World!</h1>
      <p>Welcome to Make Your Pins. The site is under construction.</p>
      <p>GCP Compute Engine deployment successful!</p>
    </div>
  </body>
  </html>
  EOL

  # Configure Nginx with proper permissions
  cat > /etc/nginx/sites-available/default <<'EOL'
  server {
      listen 80 default_server;
      listen [::]:80 default_server;

      root /var/www/html;
      index index.html;

      server_name _;

      location / {
          try_files $uri $uri/ =404;
      }
  }
  EOL

  # Ensure proper permissions
  chown -R www-data:www-data /var/www/html
  chmod -R 755 /var/www/html

  # Restart Nginx and ensure it's enabled
  systemctl enable nginx
  systemctl restart nginx

  # Debug info
  netstat -tulpn | grep :80 > /var/log/nginx_ports.log
  systemctl status nginx > /var/log/nginx_status.log
EOF

  # Add tags for firewall rules
  tags = ["http-server", "https-server", "ssh"]

  # For free tier, use always free resources
  scheduling {
    preemptible       = false
    automatic_restart = true
  }

  # Allow stopping to update configuration
  allow_stopping_for_update = true
}