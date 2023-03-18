import { Body, Controller, Post, Res } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Controller('birdhouse')
export class BirdhouseController {
    
    @Post('house')
    registerNewBirdhouse(@Body() body, @Res() res) {
      const { longitude, latitude, name } = body;
  
      const id = uuidv4();
      const ubid = uuidv4();
  
      const newBirdhouse = {
        id,
        ubid,
        birds: 0,
        eggs: 0,
        longitude,
        latitude,
        name,
      };
  
      return res.status(201).json(newBirdhouse);
    }
}
