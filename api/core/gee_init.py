import ee

# Authenticate and initialize Earth Engine
def init_gee():
    ee.Authenticate()
    ee.Initialize(project="gee-dashboard-project")
